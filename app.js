const fs = require('fs');
const path = require('path');

const folder = process.argv[2];
const workingDir = path.join('C:/nodeJS', folder);
if (!folder || !fs.existsSync(workingDir)) {
  console.log('존재하는 폴더명을 입력해주세요');
  return;
}

const videoDir = path.join(workingDir, 'video');
const capturedDir = path.join(workingDir, 'captured');
const duplicatedDir = path.join(workingDir, 'duplicated');

!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir);

fs.promises.readdir(workingDir).then(processDir).catch(console.log);

function processDir(files) {
  files.forEach(file => {
    if (isVideoFile(file)) {
      move(file, videoDir);
    } else if (isCapturedFile(file)) {
      move(file, capturedDir);
    } else if (isDuplicatedFile(files, file)) {
      move(file, duplicatedDir);
    }
  });
}

function isVideoFile(file) {
  const regExp = /(mp4|mov)$/gm;
  const match = file.match(regExp);
  return !!match;
}
function isCapturedFile(file) {
  const regExp = /(PNG|aae)$/gm;
  const match = file.match(regExp);
  return !!match;
}
function isDuplicatedFile(files, file) {
  if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
    return false;
  }

  // 수정된 파일인 지 확인 (_E: 수정된 파일)
  const edited = `IMG_E${file.split('_')[1]}`;
  const found = files.includes(edited);
  return !!found;
}

function move(file, targetDir) {
  console.info(`move ${file} to ${path.basename(targetDir)}`);
  const oldPath = path.join(workingDir, file);
  const newPath = path.join(targetDir, file);
  fs.promises.rename(oldPath, newPath).catch(console.error);
}
