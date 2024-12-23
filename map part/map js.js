let  nowMarkers;
let  pokemonCnt = 0;
let  pokemonImg;
const markers = document.querySelectorAll('.marker');
const tooltip = document.getElementById('photo-tooltip');
const tooltipImage = document.getElementById('tooltip-image');
const canva = document.getElementById("canvas");
const buttons = document.querySelectorAll('.button-group button');

  // 為每個標記點添加點擊事件
  markers.forEach(marker => {
    marker.addEventListener('click', (e) => {
        if(!nowMarkers){
            nowMarkers = marker;
            marker.classList.add("active");

            const photoSrc = marker.getAttribute('data-photo'); // 獲取對應的照片路徑
            tooltipImage.src = photoSrc; // 更新圖片路徑

            // 計算視窗位置
            const markerRect = marker.getBoundingClientRect();
            const containerRect = document.querySelector('.map-container').getBoundingClientRect();
            
            // 調整位置，確保不超出地圖邊界
            let top = markerRect.top - containerRect.top + marker.offsetHeight / 2 + 10;
            let left = markerRect.left - containerRect.left + marker.offsetWidth / 2;
            let ptop = containerRect.top;
            let pleft = containerRect.left;

            // 如果圖片視窗超出地圖右邊界，調整左側位置
            if (left + 500 > containerRect.width) {
                left -= 500;
            }
            pleft += Math.floor((Math.random() * 400));
            // 如果圖片視窗超出地圖底部，調整頂部位置
            if (top + 300 > containerRect.height) {
                top -= 300;
            }    
            ptop += Math.floor((Math.random() * 220 - 50));
            
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            canva.style.top = `${ptop}px`;
            canva.style.left = `${pleft}px`;

            let buttonValue = {first: undefined, second: undefined, third: undefined};
            buttonValue.first = Math.floor(Math.random() * 1009 + 1);
            buttonValue.second = Math.floor(Math.random() * 1009 + 1);
            buttonValue.third = Math.floor(Math.random() * 1009 + 1);
            
            getPokemon(buttonValue, (img) => {
                drawing(img); // 將寶可夢圖片繪製到畫布上
                tooltip.style.display = 'block';
                canva.style.display = 'block';
            })
            .then(() => {
                setButton(buttonValue);
            })
        }
    });
});

function setButton(dict) {
    const keys = Object.keys(dict);  
    let num;

    buttons.forEach((button) => {
        if (keys.length > 0) {
            num = Math.floor(Math.random() * keys.length);  
            button.innerText = dict[keys[num]]; 
            if(keys[num] === 'first')button.value = 'ans';
            else button.value = 'no';
            delete dict[keys[num]];  // 從字典中刪除這個鍵
            keys.splice(num, 1);  // 從 keys 陣列中移除這個鍵
        }
    });
}

function press(e){
    if(e.target.value == 'ans'){
      pokemonCnt++;
      let scImg = document.getElementById(`scImg${pokemonCnt}`);
      let scName = document.getElementById(`scName${pokemonCnt}`);

      playerData['pokemon' + pokemonCnt] = scName.innerText = e.target.innerText;
      scImg.src = pokemonImg.src;
      e.target.innerText = 'Catch!';
      setTimeout(() => clear(), 1000)
    }
    else if(e.target.value == 'no')clear();
    else return;

    console.log(playerData);
}

function clear(){
    tooltip.style.display = 'none';
    canva.style.display = 'none';
    buttons.forEach((button, index) => {
        button.value = null;
        button.innerText = `按鈕${index + 1}`;
    })

    if(nowMarkers){
        nowMarkers.classList.remove("active");
        nowMarkers = null;
    }
}
        
// 點擊地圖其他區域時隱藏圖片視窗
document.querySelector('.map-container').addEventListener('click', (e) => {
    if (!e.target.classList.contains('marker')) {
        clear();
    }
});

function getPokemon(dict, callback) {
    // 儲存所有的 fetch 請求
    let promises = [];

    // 將每個 pokemon 的 fetch 請求加入 promises 陣列
    Object.entries(dict).forEach(([key, value]) => {
        var url = `https://pokeapi.co/api/v2/pokemon/${value}`;
        
        // 新建一個 Promise 並加入 promises 陣列
        promise = fetch(url)
            .then(response => response.json())
            .then(data => {
                dict[key] = data.name;
                if (key === 'first') {
                    let img = new Image();
                    img.src = data.sprites.front_default;
                    pokemonImg = img;
                    img.onload = () => callback(img);
                }
            })
            .catch(error => {
                console.error('錯誤:', error);
                alert('找不到這隻寶可夢！');
            });

        promises.push(promise); // 把每個 fetch 的 promise 存入 promises 陣列
    });

    // 等待所有的請求完成
    return Promise.all(promises);
}

function drawing(img){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // 設置 Canvas 大小與圖片一致
    canvas.width = img.width;
    canvas.height = img.height;

    // 先繪製原圖
    ctx.drawImage(img, 0, 0);

    // 使用黑色濾鏡塗黑圖片
    ctx.globalCompositeOperation = 'source-atop'; // 改變混合模式
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // 塗黑色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}