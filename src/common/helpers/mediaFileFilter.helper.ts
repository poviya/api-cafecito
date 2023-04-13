export const mediaFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  //console.log({ file })
  // evalua si es valido
  if (!file) return callback(new Error('File is empty'), false);

  const fileExptension = file.mimetype.split('/')[1];
  //console.log(fileExptension);
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4'];

  if (validExtensions.includes(fileExptension)) {
    return callback(null, true);
  }

  callback(null, false);
};
