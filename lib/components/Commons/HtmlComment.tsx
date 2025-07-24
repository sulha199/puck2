import {useCallback, useEffect, useRef, type FC, type PropsWithChildren} from 'react';

export const HtmlComment: FC<{children?: string | undefined}> = ({children}) => {
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myRef.current) {
      const doc = new DOMParser().parseFromString("<xml></xml>", "application/xml");
      const comment = doc.createComment(myRef.current.innerHTML);
      // myRef.current.after(`<!${!disableHyphenStart && '--'} ${myRef.current.innerHTML} ${!disableHyphenEnd && '--'}>`);
      myRef.current.after(comment);
      myRef.current.remove();
    }
  }, [myRef.current]);

  return <div ref={myRef}>{children}</div>;
}

export const HtmlCommentStart: FC<PropsWithChildren> = ({children}) => {
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myRef.current) {
      const doc = new DOMParser().parseFromString("<xml></xml>", "application/xml");
      const comment = doc.createComment(myRef.current.innerHTML);
      comment.substringData
      myRef.current.after(`<!--${myRef.current.innerHTML}`);
      // myRef.current.after(comment);
      myRef.current.remove();
    }
  }, [myRef.current]);

  return <div ref={myRef}>{children}</div>;
}

export const HtmlCommentEnd: FC<PropsWithChildren> = ({children}) => {
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myRef.current) {
      // const doc = new DOMParser().parseFromString("<xml></xml>", "application/xml");
      // const comment = doc.createComment(myRef.current.innerHTML);
      myRef.current.after(`${myRef.current.innerHTML}-->`);
      // myRef.current.after(comment);
      myRef.current.remove();
    }
  }, [myRef.current]);

  return <div ref={myRef}>{children}</div>;
}