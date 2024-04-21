#!/bin/bash

# Concurrently run both network receiver and vite frontend
npm run dev & python3 ./network/receiver.py & python3 ./network/app.py && fg
