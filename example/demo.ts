import { contentCompiler } from "../src/compiler/compiler";

const templ =  `
@-- dynamic conent from user input --@

<p> Hello @{{ username }} ! </p>

@-- dynamic conent from condition --@

@if(!username)
<p> Show [ if ] Block! </p>
@elseif(username==='anyname')
<p> Show [ else if ] Block! </p>
@else
<p> Show [ else ] Block! </p>
@endif

@-- dynamic conent from forloop --@

@for(let item of items)
<p> name: @{{item.name}} </p>
@endfor

@for(let key in items)
 <p> @{{ key }} - @{{items[key].name}} </p>
@endfor`;

const template = contentCompiler(templ, {
 path: 'your_dirname/test.ts',
 filename: 'test.ts',
 options: {
   delimiter: {
     interpolate: {
       enable: true,
     },
     escape: {
       enable: false
     }
   }
 }
});


(async () => {
  const compiled = await template({
    username: 'Wayne',
    items: [
        {
            name: 'John'
        },
        {
            name: 'Allen'
        },
        {
            name: 'Judy'
        }
    ]
  });
  console.log(compiled);
})();