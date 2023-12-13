--- CREATE DATABASE IF NOT EXISTS ---
SELECT 'CREATE DATABASE trelloapp'
WHERE NOT EXISTS (SELECT FROM  pg_database WHERE datname = 'trelloapp')\gexec


CREATE USER trello WITH PASSWORD 'trellopass';

GRANT ALL PRIVILEGES ON DATABASE trelloapp TO trello;