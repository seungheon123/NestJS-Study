#!/usr/bin/env node

const inquirer = require('inquirer');
const { execSync } = require('child_process');

const commitTypes = [
  { name: ':sparkles: [Feat] 새로운 기능 추가', value: ':sparkles: [Feat]' },
  { name: ':bug: [Fix] 버그 수정', value: ':bug: [Fix]' },
  { name: ':memo: [Docs] 문서 추가 및 수정', value: ':memo: [Docs]' },
  { name: ':recycle: [Refactor] 코드 리팩토링', value: ':recycle: [Refactor]' },
  { name: ':fire: [Remove] 코드 제거', value: ':fire: [Remove]' },
  { name: ':rocket: [Deploy] 배포 관련 작업', value: ':rocket: [Deploy]' },
];

inquirer
  .prompt([
    {
      type: 'list',
      name: 'type',
      message: '커밋 타입을 선택하세요:',
      choices: commitTypes,
    },
    {
      type: 'input',
      name: 'message',
      message: '커밋 메시지를 입력하세요:',
    },
  ])
  .then((answers) => {
    const { type, message } = answers;
    const commitMessage = `${type} ${message}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  })
  .catch((error) => {
    console.error('커밋 중 오류 발생:', error);
  });
