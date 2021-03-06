# Export database

# PWD at root of project
# Run ./scripts/export.sh directory_name

if [ $# == 0 ]
then
  echo 'Error: Wrong statment syntax'
  echo 'Please export to db/[directory_name]'
  echo './script/export.sh [directory_name]'
  exit
fi

echo '\n\nExport database to db/'$1 '...\n\n'

mongoexport --db MoST --collection users --out ./db/$1/users.json
mongoexport --db MoST --collection records --out ./db/$1/records.json
mongoexport --db MoST --collection polls --out ./db/$1/polls.json
mongoexport --db MoST --collection votes --out ./db/$1/votes.json
mongoexport --db MoST --collection events --out ./db/$1/events.json
mongoexport --db MoST --collection villages --out ./db/$1/villages.json
mongoexport --db MoST --collection booths --out ./db/$1/booths.json
mongoexport --db MoST --collection interests --out ./db/$1/interests.json
mongoexport --db MoST --collection tickets --out ./db/$1/tickets.json
mongoexport --db MoST --collection entries --out ./db/$1/entries.json

echo '\n\nExport successfully\n\n'
