export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  //console.log(file);
  // evalua si es valido
  if (!file) return callback(new Error('File is empty'), false);
  const fileExptension1 = file.mimetype.split('/')[1];
  const fileExptension2 = file.originalname.split('.')[1];
  // console.log(fileExptension1);
  // console.log(fileExptension2);
  //console.log(fileExptension);
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'jfif', 'mp4', 'ico'];

  if (validExtensions.includes(fileExptension1)) {
    //console.log(1);
    return callback(null, true);
  }

  if (validExtensions.includes(fileExptension2)) {
    console.log(1);
    return callback(null, true);
  }

  console.log(0);
  callback(null, false);
};
