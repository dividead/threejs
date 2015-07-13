
//image
var url		= 'images/nice.png'
var image	= document.createElement('img')
image.src	= url
image.addEventListener('load', function(){
	dynamicTexture.drawImage(image, 0, 0);
  drawNumbers();
})


//sudoku
let a = [[0,1,0],[1,1,1],[0,1,0],[1,0,1]]

function sq(x){
  return x.filter((y) => y).length
}

function zip(a){
  return a[0].map((_,i) => a.map((x) => x[i]))
}

let b = a.map(sq)
let c2 = zip(a).map(sq)



let c = a[0].map((_,i) => a.map((x) => x[i])).map((x) => x.filter((y) => y).length)
let s = a.map((x) => x.join(' ').replace(/1/g, "\u25A0").replace(/0/g, "\u25A1"))

console.log('  ' + c.join(' '))

for(let i in b){
  console.log(b[i] + ' ' + s[i])
}
