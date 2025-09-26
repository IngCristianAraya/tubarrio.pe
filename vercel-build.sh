#!/bin/bash
npm install --ignore-scripts
npm rebuild sharp --build-from-source --target_arch=x64 --target_platform=linux --target_libc=glibc
next build
