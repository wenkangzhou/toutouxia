var thisUrl = document.URL;
var filenamep = /\w*\.mp3/i;
var filenamep_ = /\w*\.m4a/i;
var imgURL = chrome.extension.getURL("music.png");
var divId = "music-pirate";
var onMsg = chrome.runtime.onMessage || chrome.extension.onMessage || chrome.extension.onRequest;
var requestQ = [];
onMsg.addListener(
  function(request, sender, sendResponse) {
    if(!document.getElementById(divId)) {
      $('body').append('<div id="' + divId + '" class="' + localStorage.piratePosition + '"><a id="dlink"><img src="' + imgURL + '"/></a></div>');
      var stopProp = function(e) {e.stopPropagation();};
      $('#dlink').mousedown(stopProp).keydown(stopProp).click(stopProp); //prevent parent event 事件冒泡
    }
    console.log(request.desc);
    console.log(request.musicUrl);
    var filename;
    var musicUrl = request.musicUrl;
    //xiami radio will preload the next song
    if(thisUrl.indexOf('www.xiami.com/radio') > 0) {
      if(requestQ.indexOf(musicUrl) != -1) return; //when download, another request will be fired. Drop this.
      requestQ.push(request.musicUrl);
      if(requestQ.length > 2) {
        requestQ.shift();
      }
      musicUrl = requestQ[0];
    }
    if(thisUrl.indexOf('www.xiami.com') > 0) {
      filename = document.title.substr(0, document.title.indexOf('—'));
    } else if(thisUrl.indexOf('douban.fm') > 0) {
      filename = document.title.substr(0, document.title.indexOf(' - '));
    } else if(thisUrl.indexOf('music.douban.com/artists/') > 0) {
      filename = $('.item-stat-play').attr('data-songname') + ' - ' + $('.artist-name a', $('.item-stat-play').parent().parent()).text();
    } else if(thisUrl.indexOf('www.songtaste.com/song') > 0) {
      filename = $('.mid_tit').text();
    } else if(thisUrl.indexOf('www.songtaste.com/playmusic.php') > 0) {
      filename = $.trim($('#songInfo a').text());
    } else if(thisUrl.indexOf('fm.renren.com') > 0) {
      filename = $('#song_name').text() + ' - ' +$('#artist_name a[title]').text();
    } else if(thisUrl.indexOf('play.baidu.com') > 0) {
      filename = document.title.substr(0, document.title.indexOf(' - 百度音乐盒'));
    } else if(thisUrl.indexOf('y.qq.com') > 0) {
      filename = $('#divplayer p.music_name').text() + ' - ' + $('#divplayer .music_info_main .singer_name').text();
    } else if(thisUrl.indexOf('music.163.com') > 0) {
      filename = $('.play .words .fc1').text() + ' - ' + $('.play .words .by').text();
    } else if(thisUrl.indexOf('ting.sina.com.cn') > 0) {
      filename = document.title.substr(0, document.title.indexOf(' - '));
    } else if(thisUrl.indexOf('player.mbox.sogou.com') > 0) {
      filename = document.title.substr(5, document.title.indexOf('-搜狗音乐') - 5);
    } else if(thisUrl.indexOf('soundcloud.com') > 0) {
      filename = document.title;
    }else if(thisUrl.indexOf('jing.fm') > 0){
      filename = $('.tit').text();
    }

    if(!filename) {
      filename = filenamep.exec(musicUrl);
      if(musicUrl.indexOf('.m4a') > 0)
        filename = filenamep_.exec(musicUrl);
    } else {
      if(musicUrl.indexOf('.m4a') > 0)
        filename = filename + '.m4a';
      else
        filename = filename + '.mp3';
    }
    $('#dlink').attr('download', filename).attr('title', filename).attr('href', musicUrl);
    (function(deg){
      var degnow = 0;
      var ro = function(){
        if(degnow === 360) return;
        degnow = degnow + deg;
        $("#music-pirate #dlink").css({'-webkit-transform': 'rotate(' + degnow + 'deg)',
                                        'transform': 'rotate(' + degnow + 'deg)'});
        setTimeout(ro, 20);
      };
      ro();
    })(12);
});