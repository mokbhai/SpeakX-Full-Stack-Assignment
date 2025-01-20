# SpeakX Placemnet Assignment.

# Setup

## First setup the .env file

copy the .env.example file and rename it to ./backend/.env
add mongo uri to the .env file
or you can use the My default uri from the .env.example file

## 1. Using Docker-compose (Implementation explained here [here](https://github.com/mokbhai/SiddhProject/blob/main/NodeJs/gRPC/client-to-server/README_Improved_By_ChatGPT.md))

```bash
./run-container.sh
```

## For seeding new DB

I have analysed the data and found this [output -> speakx_questions_analysis](./server/seed/speakx_questions_analysis.json)

download the speakx_questions.json file from the [here](https://drive.google.com/file/d/1CZ0GX4opA4grkLunRuWwH7bwlmfcSeUQ/view)
and copy it to the backend folder

```bash
cd backend
npm run seed
```

## Steps I followed for creating this project are avalable in backend and frontend folder

see backend steps by clicking [here](./backend/README.md)
see frontend steps by clicking [here](./frontend/README.md)
