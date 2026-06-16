import sharp from "sharp";

export const mse =
  async (
    img1: string,
    img2: string,
  ) => {

    const a =
      await sharp(img1)
        .raw()
        .toBuffer({
          resolveWithObject:true
        });

    const b =
      await sharp(img2)
        .raw()
        .toBuffer({
          resolveWithObject:true
        });

    if(
      a.data.length !==
      b.data.length
    ){
      throw new Error(
        "Image dimensions mismatch"
      );
    }

    let error = 0;

    for(
      let i=0;
      i<a.data.length;
      i++
    ){
      const diff =
        a.data[i] -
        b.data[i];

      error += diff * diff;
    }

    return (
      error /
      a.data.length
    );
  };