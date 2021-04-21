let id = ''
let data = ''
let img_array = []
let delay = 250

function get_image_id(){
    ele = document.getElementById('image_id')
    id = ele.value
    console.log('ID: ',id)
    return id
    //if (event.keyCode==13){
    //    id = ele.value
    //    console.log('ID: ',id)
    //}
}

function decode(data){
    
    BACKGROUND_COLOR = 'A0A0A0'

    for (let index = 0; index < 24*24; index++){
        img_array[index] = BACKGROUND_COLOR
    }
    
    for (let index = 0; index < data.length; index++){
        element = data[index]
        x = element.x_location
        y = element.y_location
        img_array[x*24+y] = element.fill_color  
    }
    //console.log(img_array)
    draw_image(img_array,'top_canvas')
    melt(img_array)
}

function get_data(){
    id = get_image_id()
    var data_src = `../static/${id}.json`;
    console.log('Getting data from: ',data_src)
    fetch(data_src)
        .then(response=>response.json())
        .then(data=>decode(data))
}

function draw_image(img_array,canvas){
    const pixel_size = 10
    var canvas = document.getElementById(canvas);
    var context = canvas.getContext("2d");
    img_array.forEach(function(profile,index){
        x = Math.floor(index/24)
        y = index%24
        context.fillStyle = '#'+profile;
        context.fillRect(y*pixel_size, x*pixel_size, pixel_size, pixel_size);
    })
}

async function melt(img_array){
    const BACKGROUND_COLOR = 'A0A0A0'
    
    for (let i = 0;i<40;i++){

        for (let index = 24*24 ; index > 0; index--){
            y = Math.floor(index/24)
            x = index%24
            if(img_array[index]==BACKGROUND_COLOR){
                continue
            }
            else if (x==23){ //right border
                if (img_array[x-1+(y+1)*24] == BACKGROUND_COLOR){
                    img_array[x-1+(y+1)*24] = img_array[x+y*24]}
            }
            else if (x==0){//#left border
                if (img_array[x+1+(y+1)*24] == BACKGROUND_COLOR){
                    img_array[x+1+(y+1)*24] = img_array[x+y*24]}
            }
            else{
                
                //console.log(x,y)
                var y_down = y+1
                var x_right= x-1
                var x_left = x+1
                if(img_array[x+y_down*24]==BACKGROUND_COLOR){
                    //console.log('Down')
                    img_array[x+y_down*24] = img_array[x+y*24]
                    img_array[x+y*24] = BACKGROUND_COLOR
                }
                /*
                else if (img_array[x_right+y_down*24] == BACKGROUND_COLOR && img_array[x_left+y_down*24] == BACKGROUND_COLOR){
                    d = Math.round(Math.random())
                    //console.log(d)
                    img_array[(x+d)+y_down*24] = img_array[x+y*24]
                    img_array[x+y*24] = BACKGROUND_COLOR
                }*/
                else if (img_array[x_right+y_down*24] != BACKGROUND_COLOR && img_array[x_left+y_down*24] == BACKGROUND_COLOR){
                    img_array[x_left+y_down*24] = img_array[x+y*24]
                    img_array[x+y*24] = BACKGROUND_COLOR
                }
                else if (img_array[x_right+y_down*24] == BACKGROUND_COLOR && img_array[x_left+y_down*24] != BACKGROUND_COLOR){
                    img_array[x_right+y_down*24] = img_array[x+y*24]
                    img_array[x+y*24] = BACKGROUND_COLOR
                }
                else{
                    continue
                }                                           
            }
        }
        await sleep(delay);
        draw_image(img_array,"bottom_canvas") 
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function save_image(){
    var canvas = document.getElementById( 'bottom_canvas' );  
    // get canvas data  
    var image = canvas.toDataURL();  
    
    // create temporary link  
    var tmpLink = document.createElement( 'a' );  
    tmpLink.download = 'image.png'; // set the name of the download file 
    tmpLink.href = image;  

    // temporarily add link to body and initiate the download  
    document.body.appendChild( tmpLink );  
    tmpLink.click();  
    document.body.removeChild( tmpLink ); 
}

