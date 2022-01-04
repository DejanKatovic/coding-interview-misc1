/**
 * In our app we have regions of text that may or not be contiguous.
 *
 * The text is given back as rectangles with x, y, width, and height properties.
 *
 * If the x, y, width, and height are close enough, we can assume they're the same word.
 *
 * Sometimes our rectangles are word fragments NOT the whole word so we need to join the words
 * again to form entire sentences.
 *
 * The test data has examples of what these partial regions would look like.
 */
export namespace TextMergeJoin {
  export interface IPDFTextWord {
    readonly pageNum: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly str: string;
  }

  /**
   *
   */
  export function doMergeWords(
    data: ReadonlyArray<IPDFTextWord>
  ): ReadonlyArray<IPDFTextWord> {
    const result: IPDFTextWord[] = [];
    let current: IPDFTextWord | undefined = undefined;
    let newStr: string = "";
    let newWidth: number = 0;
    let newHeight: number = 0;
    data.forEach((item, index) => {
      if (current === undefined) {
        current = item;
        newStr = item.str;
        newWidth = item.width;
        newHeight = item.height;
      } else {
        let currentXEnd: number = current.x + newWidth;
        let currentYEnd: number = current.y + newHeight;
        let itemXEnd: number = item.x + item.width;
        let itemYEnd: number = item.y + item.height;
        if (
          item.x >= current.x &&
          item.x <= currentXEnd &&
          item.y >= current.y &&
          item.y <= currentYEnd
        ) {
          newStr += item.str;
          newWidth =
            currentXEnd >= itemXEnd
              ? newWidth
              : parseFloat((current.width + item.width).toFixed(7));
          newHeight =
            currentYEnd >= itemYEnd
              ? newHeight
              : parseFloat((current.height + current.height).toFixed(7));
        } else {
          result.push({
            ...current,
            width: newWidth,
            height: newHeight,
            str: newStr,
          });
          current = item;
          newStr = item.str;
          newWidth = item.width;
          newHeight = item.height;
        }
        if (index === data.length - 1) {
          result.push({
            ...current,
            width: newWidth,
            height: newHeight,
            str: newStr,
          });
        }
      }
    });
    return result;
  }
}
