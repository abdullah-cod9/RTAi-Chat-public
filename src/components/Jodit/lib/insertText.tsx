import type { Jodit } from "jodit-react";

export function InsertText(
  updatedCompletion: string,
  editor: Jodit,
  responsePosition: string,
  responseColour: string,
  isFirstTime: boolean,
  setIsFirstTime: (isFirstTime: false) => void,
) {
  switch (responsePosition) {
    case "after":
      {
        if (isFirstTime) {
          editor.s.focus();
          const selectedText = editor.s.html;
          editor.s.insertHTML(selectedText);
          const span = editor.createInside.element("span");
          span.style.color = responseColour;
          span.style.whiteSpace = "pre-wrap";
          span.textContent = " " + updatedCompletion;
          editor.s.insertNode(span);
          editor.s.setCursorIn(span);
          setIsFirstTime(false);
        } else {
          editor.s.focus();
          editor.s.insertHTML(updatedCompletion);
        }
      }
      break;
    case "under":
      {
        if (isFirstTime) {
          editor.s.focus();

          // التحقق من أن النص المحدد داخل <ul> أو <li>
          const currentRange = editor.s.range;

          // @ts-expect-error: startContainer is not recognized, but it exists on Range
          const closestListItem = currentRange.startContainer.closest("li");
          // @ts-expect-error: startContainer is not recognized, but it exists on Range
          const closestList = currentRange.startContainer.closest("ul, ol");

          if (closestListItem || closestList) {
            // الخروج من السياق بإضافة عنصر جديد خارج <ul>
            const parentList = closestList || closestListItem?.parentElement;
            const br = editor.create.element("br");
            parentList?.after(br); // وضع العنصر الجديد خارج القائمة
            editor.s.select(br, true); // نقل المؤشر خارج السياق
          }

          const selectedText = editor.s.html;
          editor.s.insertHTML(selectedText);

          const p = editor.create.element("p");
          p.style.color = responseColour;
          p.style.whiteSpace = "pre-wrap";
          p.textContent = updatedCompletion;
          p.dir = "auto";
          editor.s.insertNode(p);
          editor.s.setCursorIn(p);

          setIsFirstTime(false);
        } else {
          editor.s.focus();
          editor.s.insertHTML(updatedCompletion);
        }
      }

      break;

    default:
      {
        if (isFirstTime) {
          editor.s.focus();
          editor.s.remove();
          // range.deleteContents();
          const span = editor.createInside.element("span");
          span.style.color = responseColour;
          span.style.whiteSpace = "pre-wrap";
          span.textContent = updatedCompletion;
          span.dir = "auto";
          editor.s.insertNode(span);
          editor.s.setCursorIn(span);
          setIsFirstTime(false);
        } else {
          editor.s.focus();
          editor.s.insertHTML(updatedCompletion);
        }
      }
      break;
  }
}
