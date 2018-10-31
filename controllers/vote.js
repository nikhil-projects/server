import mongoose from 'mongoose';
import moment from 'moment';
import cryptoJS from 'crypto-js';

import * as EthCtrl from './eth';

const Poll = mongoose.model('Poll');
const Vote = mongoose.model('Vote');

// Only for test
export const findAll = async (req, res, next) => {
  Vote.find().exec().then((votes) => {
    res.status(203).send(votes);
  })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err.message });
    });
};

export const create = async (req, res, next) => {

  const { pollID, userID, questions } = req.body;

  try {
    /** Check pollID existen */
    const poll = await Poll.findOne({ id: pollID });
    console.log(poll);

    if (!poll) {
      return res.status(404).send({ message: 'No poll existen with the poll ID' });
    }

    /** Check time */
    if (moment().isBefore(moment(poll.startDate))) {
      return res.status(400).send({ message: 'It\'s not time to vote' });
    }
    if (moment().isAfter(moment(poll.endDate))) {
      return res.status(400).send({ message: 'It\'s too late to vote' });
    }

    /** Check user permission */
    // TODO

    /** Check questions */
    const validQuestions = JSON.parse(questions);
    /**
    const validQuestions = questions.map((q) => {
      const { ordinal, type, options } = q;
      if (!ordinal || !type || !options) return null;
      if (type !== 'Rating' && type !== 'Polling') return null;
      if (!options.length) return null;
      const pollQuestion = (poll.questions.filter(o => o.ordinal === ordinal) || [])[0];
      if (!pollQuestion) return null;
      if (type !== pollQuestion.type) return null;
      if (type === 'Polling') {
        if (options.length > pollQuestion.maxSelected) return null;
      }
      q.options = [...options].filter(o => (
        pollQuestion.options.filter(p => p.ordinal === o.ordinal) || [])[0] !== null);

      return q;
    }).filter(o => o !== null);

    if (validQuestions.length === 0) {
      return res.status(400).send({ message: 'No valid questions' });
    }
    */

    /** Create new Vote instance */
    const voteInstance = new Vote({
      userID, pollID,
      questions: validQuestions
    });
    voteInstance.id = voteInstance._id.toString();
    voteInstance.hashValue =
      `0x${cryptoJS.SHA256(`${voteInstance.userID}-${voteInstance.pollID}`).toString(cryptoJS.enc.Hex)}`;

    /** Save data to mongo */
    const vote = await voteInstance.save();

    /** Send to client */
    res.status(200).send(vote);


    /** push to smart contract */
    const commit = await EthCtrl.createVoting({
      voteID: vote.id,
      contractAddress: poll.eth.contractAddress,
      hashValue: vote.hashValue,
      secretKey: poll.eth.contractSecretKey,
      userID
    });
    console.log('Voting is pushed');
    console.log(commit);

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }

};