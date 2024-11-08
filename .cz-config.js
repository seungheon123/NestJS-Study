module.exports = {
  types: [
    { value: ':sparkles: [Feat]', name: '✨ Feat: 새로운 기능 추가' },
    { value: ':bug: [Fix]', name: '🐛 Fix: 버그 수정' },
    { value: ':memo: [Docs]', name: '📝 Docs: 문서 추가 및 수정' },
    { value: ':recycle: [Refactor]', name: '♻️ Refactor: 코드 리팩토링' },
    { value: ':fire: [Remove]', name: '🔥 Remove: 코드 제거' },
    { value: ':rocket: [Deploy]', name: '🚀 Deploy: 배포 관련 작업' },
  ],
  messages: {
    type: '커밋할 타입을 선택하세요:',
    subject: '커밋 메시지를 입력하세요 (필수):',
    confirmCommit: '이 커밋 메시지로 커밋하시겠습니까?',
  },
  allowCustomScopes: false,
  skipScope: true,
  subjectLimit: 72,
};