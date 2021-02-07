// https://github.com/ryanhuellen/tailwindui-jsx-chrome-extension

// https://stackoverflow.com/a/2970667
function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

function htmlToJSX(html) {
  return (
    html
      // Change self-closing elements to end with `/>` instead of `>`
      .replace(/(?<=<(input|img|br|hr).*)>/g, '/>')

      // Replace `class=` with `className=`
      .replace(/class=/g, 'className=')

      // Replace inline styles with style object
      .replace(/style="([^"]*)"/g, (_, styles) => {
        const regex = /(\s*([\w-]*)\s*:\s*([^;]+))/g;
        const matches = Array.from(styles.matchAll(regex));
        return `style={{${matches
          .map((m) => `${camelCase(m[2])}: "${m[3]}"`)
          .join(',')}}}`;
      })

      // Replace html comments with JSX comments
      // .replace(/(<!--\s*(.*)\s*-->)/g, "{/* $2 */}")
      .replace(/\<!--/g, '{/*')
      .replace(/--\>/g, '*/}')

      // Replace `tabindex="0"` with `tabIndex={0}`
      .replace(/tabindex="([^"]*)"/g, 'tabIndex={$1}')

      // Replace `datetime` with `dateTime` for <time />
      .replace(/datetime=/g, 'dateTime=')

      // Replace `clip-rule` with `clipRule` in svg's
      .replace(/clip-rule=/g, 'clipRule=')

      // Replace `fill-rule` with `fillRule` in svg's
      .replace(/fill-rule=/g, 'fillRule=')

      // Replace `stroke-linecap` with `strokeLinecap` in svg's
      .replace(/stroke-linecap=/g, 'strokeLinecap=')

      // Replace `stroke-width` with `strokeWidth` in svg's
      .replace(/stroke-width=/g, 'strokeWidth=')

      // Replace `stroke-linejoin` with `strokeLinejoin` in svg's
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')

      // Replace `for` with `htmlFor` in forms
      .replace(/for=/g, 'htmlFor=')

      // Trim the whitespace!
      .trim()
  );
}

var getClosest = function (elem, selector) {
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem;
  }
  return null;
};

function wrap(jsx) {
  const lines = jsx.split('\n');
  const indented = lines.map((line) => '    ' + line).join('\n');
  return `export default function Component() {\n  return (\n${indented}\n  );\n}`;
}

function main() {
  [...document.querySelectorAll('pre')].forEach((pre) => {
    pre.classList.remove('language-html');
    pre.classList.add('language-jsx');

    const code = pre.querySelector('code');
    code.classList.remove('language-html');
    code.classList.add('language-jsx');

    const codeString = code.innerText;
    const newCodeString = wrap(htmlToJSX(codeString));

    code.innerHTML = Prism.highlight(newCodeString, Prism.languages.jsx, 'jsx');

    const textarea = getClosest(pre, '[id^=component]').querySelector(
      'textarea'
    );
    textarea.value = newCodeString;
  });
}

window.addEventListener('load', main);
