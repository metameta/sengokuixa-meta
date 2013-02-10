// ==UserScript==
// @name           sengokuixa-meta
// @description    戦国IXAを変態させるツール
// @version        1.1.3.0
// @namespace      sengokuixa-meta
// @include        http://*.sengokuixa.jp/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

/*

音素材は下記のサイトを利用しています
ポケットサウンド様
http://pocket-se.info/

*/

(function( $ ) {

//■■■■■■■■■■■■■■■■■■■

//■ プロトタイプ

//. String.prototype
$.extend( String.prototype, {

//.. toInt
toInt: function() {
	return parseInt( this.replace(/,/g, ''), 10);
},

//.. toFloat
toFloat: function() {
	return parseFloat( this.replace(/,/g, '') );
},

//.. repeat
repeat: function( num ) {
	var str = this, result = '';
	for ( ; num > 0; num >>>= 1, str += str ) { if ( num & 1 ) { result += str; } }
	return result;
},

//.. getTime - yyyy-mm-dd hh:mi:ss
getTime: function() {
	if ( !/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test( this ) ) {
		throw new Error('Invalid string');
	}

	var date = this.replace(/-/g, '/');

	return ~~( new Date( date ).getTime() / 1000 );
}

});

//. Number.prototype
$.extend( Number.prototype, {

//.. toInt
toInt: function() {
	return this;
},

//.. toFloat
toFloat: function() {
	return this;
},

//.. toRound
toRound: function( decimal ) {
	decimal = ( decimal === undefined ) ? 0 : decimal;

	var num = Math.pow( 10, decimal );

	return Math.round( this * num ) / num;
},

//.. toFormatNumber - 9,999,999
toFormatNumber: function( prefix, replaceNaN ) {
	if ( isNaN( this ) ) {
		return replaceNaN || '';
	}

	var num = new String( this );
	prefix = prefix || '';

	while ( num != ( num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2") ) );

	return prefix + num;
},

//.. toFormatDate - 0000/00/00 00:00:00
toFormatDate: function() {
	var date = new Date( this * 1000 );

	return date.toFormatDate();
},

//.. toFormatTime - 00:00:00
toFormatTime: function() {
	var h = Math.floor(this / 3600),
		m = Math.floor((this - (h * 3600)) / 60 ),
		s = Math.floor(this - (h * 3600) - (m * 60));

	var str = (h + 100).toString().substr( -2 ) + ':' +
			  (m + 100).toString().substr( -2 ) + ':' +
			  (s + 100).toString().substr( -2 );

	return str;
}

});

//. Date.prototype
$.extend( Date.prototype, {

//.. toFormatDate - 0000/00/00 00:00:00
toFormatDate: function() {
	var str = '';

	str += this.getFullYear() + '/' + (this.getMonth() + 1) + '/' + this.getDate();
	str += ' ';
	str += ('00' + this.getHours()  ).substr(-2, 2) + ':' +
		   ('00' + this.getMinutes()).substr(-2, 2) + ':' +
		   ('00' + this.getSeconds()).substr(-2, 2);

	return str;
}

});

//. Array.prototype
$.extend( Array.prototype, {

//.. unique
unique: function() {
	var result = [], temp = {};

	for ( var i = 0, len = this.length; i < len; i++ ){
		if ( !temp[ this[ i ] ] ) {
			temp[ this[ i ] ] = true;
			result.push( this[ i ] );
		}
	}

	return result;
}

});

//■ jQueryプラグイン
//. contextMenu
(function($){var timer,defaults={class_menuitem:'imc_menuitem',class_title:'imc_menutitle',class_separater:'imc_separater',class_nothing:'imc_nothing',class_hover:'imc_hover',timeout:500},options=$.extend({},defaults);$.contextMenu=function(_options){options=$.extend({},defaults,_options);return this};$.extend($.contextMenu,{title:function(key){key=key||'';return $('<li/>').addClass(options.class_title).text(key)},separator:function(){return $('<li/>').addClass(options.class_separater)},nothing:function(key){key=key||'';return $('<li/>').addClass(options.class_nothing).text(key)}});$.fn.contextMenu=function(menu,live){if(live){this.live('contextmenu',collback)}else{this.on('contextmenu',collback)}return this;function collback(e){show.call(this,menu,e);return false}};function show(menu,e){var x=e.pageX,y=e.pageY,menuContainer,containerRight,containerBottom,documentRight,documentBottom;hide();if(typeof(menu)=='function'){menu=menu.call(this,e)}if(menu==null||menu.length==0){return}menuContainer=createMenuList.call(this,menu,e);if(!menuContainer){return}menuContainer.attr('id','imi_contextmenu').css({left:x,top:y}).appendTo('BODY');containerRight=menuContainer.offset().left+menuContainer.width()+10;containerBottom=menuContainer.offset().top+menuContainer.height()+10;documentRight=$(document).scrollLeft()+$(window).width();documentBottom=$(document).scrollTop()+$(window).height();if(containerRight>documentRight){x=x-(containerRight-documentRight);menuContainer.css({left:x})}if(containerBottom>documentBottom){y=y-(containerBottom-documentBottom);menuContainer.css({top:y})}(function(container){var self=arguments.callee;if(container.width()+10>documentRight-container.offset().left){container.css({left:-container.width()-2})}if(container.height()+10>documentBottom-container.offset().top){container.css({marginTop:-container.height()+13})}container.find('> LI > .imc_submenu').each(function(){self.call(self,$(this))})})(menuContainer)}function hide(){var $menu=$('#imi_contextmenu');if($menu.length==0){return}$menu.remove();clearTimeout(timer);timer=null};function createMenuList(menu,e,sub){var itemlist=[],$menu;for(key in menu){var menuitem=createMenuItem.call(this,key,menu[key],e);itemlist.push(menuitem.get(0))}if(itemlist.length==0){return null}$menu=$('<ul class="imc_menulist"/>').append(itemlist);if(sub){$menu.addClass('imc_submenu')}return $menu}function createMenuItem(key,menuitem,e){var self=this;if(menuitem===null||menuitem===undefined){return $.contextMenu.nothing(key)}else if(menuitem===$.contextMenu.title){return menuitem.call(self,key)}else if(menuitem===$.contextMenu.separator){return menuitem.call(self)}else if(menuitem===$.contextMenu.nothing){return menuitem.call(self,key)}else if(typeof(menuitem)=='string'){return $('<li/>').addClass(options.class_menuitem).text(menuitem)}else if(typeof(menuitem)=='function'){return $('<li/>').addClass(options.class_menuitem).text(key).click(function(){hide();menuitem.call(self,e)})}else if(menuitem.jquery){return $('<li/>').addClass(options.class_menuitem).append(menuitem)}else{var submenu=createMenuList.call(this,menuitem,e,true);return $('<li/>').addClass(options.class_menuitem).append(submenu).append(key+'<span class="imc_submenu_mark">‣</span>')}}$(document).on('click',hide).on('contextmenu',hide).on('contextmenu','#imi_contextmenu',function(){return false}).on('mouseenter','#imi_contextmenu',function(){if(timer){clearTimeout(timer);timer=null}}).on('mouseleave','#imi_contextmenu',function(){if(options.timeout>0){timer=setTimeout(hide,options.timeout)}})})(jQuery);
//. autoPager
(function($){var $window=$(window),$document=$(document),fetchPage={},nextPage,container,defaults={next:'',contants:'',container:'',load:function(page){return $.get(page)},loaded:function(html){},ended:function(){}},options=$.extend({},defaults);$.autoPager=function(_options){options=$.extend({},defaults,_options);nextPage=getNext(document);container=$(options.container);if(container.length!=0){$window.scroll(pageScroll)}return this};$.extend($.autoPager,{});function getNext(html){var nextPage;if($.isFunction(options.next)){nextPage=options.next(html)}else{nextPage=$(html).find(options.next).attr('href')}return nextPage}function pageScroll(){var containerBottom=container.offset().top+container.height(),documentBottm=$document.scrollTop()+$window.height();if(containerBottom<documentBottm){pageLoad()}};function pageLoad(){if(nextPage==undefined){return}if(fetchPage[nextPage]){return}fetchPage[nextPage]=true;var jqXhr=options.load(nextPage);jqXhr.pipe(function(html){nextPage=getNext(html);options.loaded(html);if(!nextPage){options.ended()}pageScroll()})}})(jQuery);
//. keybind
// https://github.com/pd/jquery.keybind
(function($){$.fn.extend({keybind:function(seq,handler){var data=this.data("keybind");if(!data){data={bindings:{}};this.data("keybind",data).bind({keypress:keypressHandler,keydown:keydownHandler})}if(typeof seq==="object")$.each(seq,function(s,h){attachBinding(data.bindings,seqChords(s),h)});else attachBinding(data.bindings,seqChords(seq),handler);return this},keyunbind:function(seq,handler){var data=this.data("keybind");if(handler!==undefined)data.bindings[seq]=$.grep(data.bindings[seq],function(h){return h!==handler});else delete data.bindings[seq];return this},keyunbindAll:function(){$(this).removeData("keybind").unbind({keypress:keypressHandler,keydown:keydownHandler});return this}});function keypressHandler(event){var data=$(this).data("keybind"),desc=keyDescription(event);if(shouldTriggerOnKeydown(desc,event))return true;return triggerHandlers(data.bindings,desc,event)}function keydownHandler(event){var data=$(this).data("keybind"),desc=keyDescription(event);if(!shouldTriggerOnKeydown(desc,event))return true;return triggerHandlers(data.bindings,desc,event)}function attachBinding(bindings,chords,handler){var chord=chords.shift(),entry=bindings[chord];if(entry){if(chords.length>0&&entry.length!==undefined)throw"Keybinding would be shadowed by pre-existing keybinding";if(chords.length===0&&entry.length===undefined)throw"Keybinding would shadow pre-existing keybinding"}else if(chords.length>0)bindings[chord]=entry={};else bindings[chord]=entry=[];if(chords.length===0)entry.push(handler);else attachBinding(entry,chords,handler)}function triggerHandlers(bindings,desc,event){var handlers=bindings[desc.name],retVal=true;if(handlers===undefined)return retVal;$.each(handlers,function(i,fn){if(fn(desc,event)===false)retVal=false});return retVal}function seqChords(seq){return seq.split(/\s+/)}function shouldTriggerOnKeydown(desc,event){if(desc.ctrl||desc.meta||desc.alt)return true;if(desc.charCode>=37&&desc.charCode<=40||event.type==="keypress"&&desc.keyCode>=37&&desc.keyCode<=40)return false;if(desc.keyCode===189||desc.keyCode===187)return true;if(desc.charCode===45||desc.keyCode===45)return true;if(desc.charCode===95||desc.keyCode===95)return true;if(desc.charCode===61||desc.keyCode===61||desc.charCode===43||desc.keyCode===43)return true;if(desc.keyCode in _specialKeys)return true;return false}function keyDescription(event){var desc={};if(event.ctrlKey)desc.ctrl=true;if(event.altKey)desc.alt=true;if(event.originalEvent.metaKey)desc.meta=true;if(event.shiftKey)desc.shift=true;desc.keyCode=realKeyCode(desc,event);desc.charCode=event.charCode;desc.name=keyName(desc,event);return desc}function realKeyCode(desc,event){var keyCode=event.keyCode;if(keyCode in _funkyKeyCodes)keyCode=_funkyKeyCodes[keyCode];return keyCode}function keyName(desc,event){var name,mods="";if(desc.ctrl)mods+="C-";if(desc.alt)mods+="A-";if(desc.meta)mods+="M-";if(event.type==="keydown"){var keyCode=desc.keyCode;if(keyCode in _specialKeys)name=_specialKeys[keyCode];else name=String.fromCharCode(keyCode).toLowerCase();if(desc.shift&&name in _shiftedKeys)name=_shiftedKeys[name];else if(desc.shift)mods+="S-"}else if(event.type==="keypress")name=String.fromCharCode(desc.charCode||desc.keyCode);else throw"could prolly support keyup but explicitly don't right now";return mods+name}var _specialKeys={8:"Backspace",9:"Tab",13:"Enter",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Del",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",187:"=",189:"-"},_funkyKeyCodes={109:189},_shiftedKeys={"1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","=":"+","-":"_"}})(jQuery);

//■ MetaStorage
var MetaStorage=(function(){var storageList={},storagePrefix='IM.',eventListener=new Object(),propNames='expires'.split(' ');function MetaStorage(name){var storageName=storagePrefix+name,storage;if(!MetaStorage.keys[storageName]){throw new Error('「'+storageName+'」このストレージ名は存在しません。');}storage=storageList[storageName];if(storage==undefined){storage=new Storage(storageName);loadData.call(storage);storageList[storageName]=storage}return storage}$.extend(MetaStorage,{keys:{},registerStorageName:function(storageName){storageName=storagePrefix+storageName;MetaStorage.keys[storageName]=storageName},clearAll:function(){$.each(MetaStorage.keys,function(idx,value){localStorage.removeItem(value)});storageList={}},import:function(string){var importData=JSON.parse(string),keys=MetaStorage.keys;this.clearAll();$.each(importData,function(key,value){if(keys[key]){localStorage.setItem(key,importData[key])}})},export:function(){var exportData={};$.each(MetaStorage.keys,function(idx,value){var stringData=localStorage.getItem(value);if(stringData){exportData[value]=stringData}});return JSON.stringify(exportData)},change:function(name,callback){var storageName=storagePrefix+name;$(eventListener).on(storageName,callback)}});function Storage(storageName){this.storageName=storageName;this.data={};return this}$.extend(Storage.prototype,{clear:function(){this.data={};clearData.call(this)},get:function(key){return this.data[key]},set:function(key,value){this.data[key]=value;saveData.call(this)},remove:function(key){delete this.data[key];saveData.call(this)},begin:function(){this.transaction=true;this.tranData=$.extend({},this.data)},commit:function(){var trans=this.transaction;delete this.transaction;delete this.tranData;if(trans){saveData.call(this)}},rollback:function(){delete this.transaction;this.data=this.tranData;delete this.tranData},toJSON:function(){return JSON.stringify(this.data)}});function loadData(){loadInternalData.call(this);this.data=load(this.storageName)}function loadInternalData(){var storageName=this.storageName+'_internal',data=load(storageName),self=this;propNames.forEach(function(propName){if(propName in data){self[propName]=data[propName]}})}function saveData(){if(this.transaction){return}saveInternalData.call(this);save(this.storageName,this.data)}function saveInternalData(){var storageName=this.storageName+'_internal',data={},self=this;propNames.forEach(function(propName){if(propName in self){data[propName]=self[propName]}});save(storageName,data)}function clearData(){if(this.transaction){return}localStorage.removeItem(this.storageName)}function load(storageName){var stringData=localStorage.getItem(storageName),parseData={};if(stringData){try{parseData=JSON.parse(stringData)}catch(e){}}return parseData}function save(storageName,data){var stringData=JSON.stringify(data);if($.isEmptyObject(data)){localStorage.removeItem(storageName)}else{localStorage.setItem(storageName,stringData)}}$(window).on('storage',function(event){var storageName=event.originalEvent.key,storage;if(!MetaStorage.keys[storageName]){return}storage=storageList[storageName];if(storage!==undefined){loadData.call(storage)}$(eventListener).trigger(storageName,event)});return MetaStorage})();

'ENVIRONMENT SETTINGS VILLAGE FACILITY ALLIANCE COUNTDOWN UNIT_STATUS USER_FALL'.split(' ').forEach(function( value ) {
	MetaStorage.registerStorageName( value );
});
'1 2 3 4 5 6 7 8 9 10 11 12 20 21'.split(' ').forEach(function( value ) {
	MetaStorage.registerStorageName( 'COORD.' + value );
});

MetaStorage.change( 'UNIT_STATUS', function( event, storageEvent ) {
	$('#imi_unitstatus').trigger('update');
	$('#imi_raid_list').trigger('update');
	$('#imi_basename').trigger('update');
});

//■■■■■■■■■■■■■■■■■■■

//■ Env
var Env = (function() {
	var storage = MetaStorage('ENVIRONMENT'),
		$server = $('#server_time'),
		$war = $('.situationWorldTable'),
		world = ( location.hostname.match(/(.\d{3})/) || [] )[1],
		start = ( document.cookie.match( new RegExp( world + '_st=(\\d+)' ) ) || [] )[1],
		login = false, season, newseason, chapter, war, server_time, local_time, timeDiff, endtime;

	//storageから取得
	endtime = storage.get('endtime');
	season  = storage.get('season');
	chapter = storage.get('chapter');

	if ( $server.length == 0 ) {
		timeDiff = 0;
	}
	else {
		//鯖との時差取得
		server_time = new Date( $server.text().replace(/-/g, '/') ).getTime(),
		local_time = new Date().getTime();

		timeDiff = ( server_time - local_time );
	}

	if ( world && start ) {
		login = true;

		//クッキーから取得
		newseason = ( document.cookie.match( new RegExp( world + '_s=(\\d+)' ) ) || [] )[1];
		chapter = ( document.cookie.match( new RegExp( world + '_c=(\\d+)' ) ) || [] )[1];

		//鯖との時差も含めてタイムアウト時間を設定（カウントダウンで鯖時間を使用する為）
		endtime = start.toInt() + (3 * 60 * 60) + Math.floor( timeDiff / 1000 );
		newseason = newseason.toInt();
		chapter = chapter.toInt();

		storage.begin();
		storage.set( 'endtime', endtime );
		storage.set( 'season', newseason );
		storage.set( 'chapter', chapter );
		storage.commit();

		document.cookie = world + '_st=0; expires=Fri, 31-Dec-1999 23:59:59 GMT; domain=.sengokuixa.jp; path=/;';
		document.cookie = world + '_s=0; expires=Fri, 31-Dec-1999 23:59:59 GMT; domain=.sengokuixa.jp; path=/;';
		document.cookie = world + '_c=0; expires=Fri, 31-Dec-1999 23:59:59 GMT; domain=.sengokuixa.jp; path=/;';

		if ( newseason !== season ) {
			//期が変わった場合
			'VILLAGE FACILITY ALLIANCE COUNTDOWN UNIT_STATUS USER_FALL'.split(' ').forEach(function( value ) {
				MetaStorage( value ).clear();
			});
			'1 2 3 4 5 6 7 8 9 10 11 12 20 21'.split(' ').forEach(function( value ) {
				MetaStorage( 'COORD.' + value ).clear();
			});

			season = newseason;
		}
	}

	if ( $war.find('IMG[src$="icon_warnow_new.png"]').length > 0 ) {
		war = 2;
	}
	else if ( $war.find('IMG[src$="icon_warnow.png"]').length > 0 ) {
		war = 1;
	}
	else {
		war = 0;
	}

	return {
		//. loginProcess
		loginProcess: login,

		//. world - 鯖
		world: world,

		//. season - 期
		season: season,

		//. chapter - 章
		chapter: chapter,

		//. war - 合戦 0:無し 1:通常合戦 2:新合戦
		war: war,

		//. timeDiff - 鯖との時差
		timeDiff: timeDiff,

		//. path - アクセスパス
		path: location.pathname.match( /[^\/]+(?=(\/|\.))/g ) || [],

		//. externalFilePath - 外部ファイルへのパス
		externalFilePath: (function() {
			var href = $('LINK[type="image/x-icon"][href^="http://cache"]').attr('href') || '';
			href = href.match(/^.+(?=\/)/) || '';

			return href;
		})(),

		//. loginState - ログイン状態
		loginState: (function() {
			var path = location.pathname;

			if ( $('#lordName').length == 1 ) { return 1; }
			if ( path == '/world/select_world.php' ) { return 0; }
			if ( path == '/user/first_login.php' ) { return 0; }
			if ( path == '/false/login_sessionout.php' ) { return -1; }
			if ( path == '/maintenance/' ) { return -1; }

			return -1;
		})(),

		//. endtime - タイムアウト期限
		endtime: endtime,

		//. ajax - 一部のajax通信の判定に使用
		ajax: false
	};
})();

//■ Util
var Util = {

//. getLocalTime
getLocalTime: function() {
	return ~~( new Date().getTime() / 1000 );
},

//. getServerTime
getServerTime: function() {
	return ~~( ( new Date().getTime() + Env.timeDiff ) / 1000 );
},

//. getTargetDate
getTargetDate: function( time, clock ) {
	clock = clock.split(':');

	var date = new Date(),
		sec = ( clock[0].toInt() * 3600 ) + ( clock[1].toInt() * 60 ) + clock[2].toInt();

	date.setTime( ( Util.getServerTime() + sec ) * 1000 );

	return ~~( date.getTime() / 1000 );
},

//. getVillageByName
getVillageByName: function( name ) {
	var list = MetaStorage('VILLAGE').get('list') || [];

	for ( var i = 0, len = list.length; i < len; i++ ) {
		if ( list[ i ].name != name ) { continue; }

		return list[ i ];
	}

	//キャッシュで見つからない場合は最新情報取得
	list = Util.getVillageList();

	for ( var i = 0, len = list.length; i < len; i++ ) {
		if ( list[ i ].name != name ) { continue; }

		return list[ i ];
	}

	return null;
},

//. getVillageById
getVillageById: function( id ) {
	var list = MetaStorage('VILLAGE').get('list') || [];

	for ( var i = 0, len = list.length; i < len; i++ ) {
		if ( list[ i ].id != id ) { continue; }

		return list[ i ];
	}

	//キャッシュで見つからない場合は最新情報取得
	list = Util.getVillageList();

	for ( var i = 0, len = list.length; i < len; i++ ) {
		if ( list[ i ].id != id ) { continue; }

		return list[ i ];
	}

	return null;
},

//. getVillageList
getVillageList: function() {
	var list = [];

	$.ajax({ type: 'get', url: '/user/', async: false })
	.done(function( html ) {
		var $html = $(html),
			$table = $html.find('TABLE.common_table1');

		//本領所領
		$table.eq( 0 ).find('TR.fs14').each(function() {
			var $this = $(this),
				type  = $this.find('TD').eq( 0 ).text(),
				$a    = $this.find('A'),
				name  = $a.eq( 0 ).text().trim(),
				id    = $a.eq( 0 ).attr('href').match(/village_id=(\d+)/)[ 1 ],
				point = $a.eq( 1 ).attr('href').match(/x=(-?\d+)&y=(-?\d+)&c=(\d+)/),
				x     = point[ 1 ].toInt(),
				y     = point[ 2 ].toInt(),
				country = point[ 3 ].toInt(),
				fall  = $this.find('TD').eq( 4 ).find('.red').length;

			list.push({ type: type, id: id, name: name, x: x, y: y, country: country, fall: fall });
		});

		//出城・陣・領地
		$table.eq( 1 ).find('TR.fs14').each(function() {
			var $this = $(this),
				type  = $this.find('TD').eq( 0 ).text(),
				$a    = $this.find('A'),
				name  = $a.eq( 0 ).text().trim(),
				id    = $a.eq( 0 ).attr('href').match(/village_id=(\d+)/)[ 1 ],
				point = $a.eq( 1 ).attr('href').match(/x=(-?\d+)&y=(-?\d+)&c=(\d+)/),
				x     = point[ 1 ].toInt(),
				y     = point[ 2 ].toInt(),
				country = point[ 3 ].toInt(),
				fall  = $this.find('TD').eq( 4 ).find('.red').length;

			list.push({ type: type, id: id, name: name, x: x, y: y, country: country, fall: fall });
		});

		MetaStorage('VILLAGE').set('list', list);
	});

	return list;
},

//. getVillageCurrent
getVillageCurrent: function() {
	var name = $('#imi_basename > .basename .on > SPAN').text();

	return Util.getVillageByName( name );
},

//. getVillageNearby
getVillageNearby: function( x, y, country ) {
	var list  = Util.getVillageList(),
		minDist = Number.MAX_VALUE,
		village;

	list.forEach(function( value ) {
		if ( value.country != country ) { return; }
		if ( value.type == '領地' ) { return; }
		if ( value.fall == 1 ) { return; }

		var dist = Util.getDistance( { x: x, y: y }, value );
		if ( dist >= minDist ) { return; }

		minDist = dist;
		village = value;
	});

	return village;
},

//. getVillageChangeUrl
getVillageChangeUrl: function( village_id, returnUrl ) {
	return '/village_change.php?village_id=' + village_id + '&from=menu&page=' + encodeURIComponent( returnUrl );
},

//. getTrainingStatus
getTrainingStatus: function( $table ) {
	$.Deferred().resolve()
	.pipe(function() {
		if ( $table ) { return $table; }

		return $.get( '/facility/unit_list.php' )
		.pipe(function( html ) {
			return $(html).find('TABLE.table_fightlist2').slice( 1 );
		});
	})
	.pipe(function( $table ) {
		var data = {};

		$table.each(function() {
			var $this = $(this),
				$tr = $this.find('TR'),
				name = $tr.eq( 0 ).find('A').text(),
				village = Util.getVillageByName( name ),
				list = [];

			$tr.slice( 1 ).each(function() {
				var $this = $(this),
					name = $this.find('IMG').attr('alt'),
					date = $this.find('TD').last().text();

				list.push( [ date.getTime(), name ] );
			});

			data[ village.id ] = list;
		});

		MetaStorage('COUNTDOWN').set('訓練', data);
	});
},

//. getPoolSoldiers
getPoolSoldiers: function() {
	var data = {};

	$.ajax({ type: 'get', url: '/facility/unit_list.php', async: false })
	.pipe(function( html ) {
		var $html = $( html ),
			$table, $cell, text;

		text = $html.find('.ig_solder_commentarea').text().split('/')[ 1 ].trim();
		data.capacity = text.toInt();
		data.soldier = $html.find('#all_pool_unit_cnt').text().toInt();
		data.pool = {};

		$table = $html.find('.table_fightlist2').first();
		$cell = $table.find('TH');

		$cell.each(function() {
			var $this = $(this),
				type = Soldier.getType( $this.text() ),
				pool = $this.next().text().toInt();

			data.pool[ type ] = pool;
		});
	});

	return data;
},

//. getUnitStatusCD
getUnitStatusCD: function() {
	var build = MetaStorage('SETTINGS').get('build') || 0;

	if ( build & 0x04 || location.pathname == '/map.php' ) {
		Util.getUnitStatus();
	}
},

//. getUnitStatusDelay
getUnitStatusDelay: function() {
	var delay = MetaStorage('COUNTDOWN').get('delaytime') || 0,
		time = Util.getLocalTime();

	if ( delay < time ) {
		MetaStorage('COUNTDOWN').set('delaytime', delay + 3);
		setTimeout( Util.getUnitStatus, 3000 );
	}
},

//. getUnitStatus
getUnitStatus: function( $table ) {
	return $.Deferred().resolve()
	.pipe(function() {
		if ( $table ) { return $table; }

		return Page.get( '/facility/unit_status.php?dmo=all' )
		.pipe(function( html ) {
			return $(html).find('.ig_fight_statusarea');
		});
	})
	.pipe(function( $table ) {
		var list = [];

		$table.each(function() {
			var $this = $(this),
				$panel = $this.find('.paneltable'),
				$a1, $a2, name, arrival, target, base1, base2,
				startpoint, targetpoint, startx, starty, endx, endy, country,
				mode, count;

			//部隊名
			name = $this.find('H3').text().match(/\[(.+)\]/)[ 1 ];

			//着弾時間
			arrival = $panel.find('TR:eq(0) TD:eq(0)').text() || '';
			arrival = ( arrival.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/) || [ 0 ] )[ 0 ];

			if ( arrival ) {
				arrival = new Date( arrival.replace(/-/g, '/') ).getTime() / 1000;
			}

			$a1 = $panel.find('TR:eq(2) TD:eq(0) A:eq(0)');
			$a2 = $panel.find('TR:eq(2) TD:eq(1) A:eq(0)');

			if ( $a1.length != 0 && $a2.length != 0 ) {
				//拠点
				base1 = $a1.text().trim();
				base2 = $a2.text().trim();
				//座標
				startpoint  = $a1.attr('href').match(/x=(-?\d+)&y=(-?\d+)&c=(\d+)/);
				targetpoint = $a2.attr('href').match(/x=(-?\d+)&y=(-?\d+)&c=(\d+)/);
				startx  = startpoint[ 1 ].toInt();
				starty  = startpoint[ 2 ].toInt();
				endx    = targetpoint[ 1 ].toInt();
				endy    = targetpoint[ 2 ].toInt();
				country = targetpoint[ 3 ].toInt();
				//目的地
				target = base2;
			}

			//行動
			mode = $this.find('TR:eq(1) TD:eq(1) IMG').attr('src') || '';

			if ( mode.indexOf('_attack.png') != -1 ) {
				count = $this.find('TR:eq(0) TD:eq(2)').text();
				mode = ( count == '-' ) ? '陣張' : '攻撃';
			}
			else if ( mode.indexOf('_develop.png') != -1 ) {
				mode = '開拓';
			}
			else if ( mode.indexOf('_meeting.png') != -1 ) {
				mode = '合流';
			}
			else if ( mode.indexOf('_backup.png') != -1 ) {
				mode = '加勢';
			}
			else if ( mode.indexOf('_return.png') != -1 || mode.indexOf('_back.png') != -1 ) {
				mode = '帰還';
				target = base1;
				[ startx, starty, endx, endy ] = [ endx, endy, startx, starty ];
			}
			else if ( mode.indexOf('_dungeon.png') != -1 ) {
				mode = '探索';
				base1 = target = $panel.find('TR:eq(1) TD:eq(2) SPAN').text().trim();
			}
			else if ( mode.indexOf('_move.png') != -1 ) {
				mode = '国移';
			}
			else if ( mode.indexOf('_wait.png') != -1 ) {
				mode = '待機';
			}
			else {
				//modeが取得できない時は加勢待機中（IMGタグではなくcssのbackgroundを使用している為）
				mode = '加待';
			}

			list.push({ name: name, mode: mode, base: base1, target: target, arrival: arrival, sx: startx, sy: starty, ex: endx, ey: endy, ec: country });
		});

		MetaStorage('UNIT_STATUS').set('部隊', list);

		$('#imi_unitstatus').trigger('update');
		$('#imi_basename').trigger('update');
	});
},

//. getBaseList
getBaseList: function( country ) {
	var list = [];

	$.ajax({ type: 'get', url: '/war/war_briefing.php', async: false })
	.pipe(function( html ) {
		var $html = $(html),
			$ul = $html.find('#ig_battle_status_tozai_brf UL'),
			$map = $html.find('#ig_battle_status_map'),
			name = $html.find('.westTeam IMG').eq( 0 ).attr('title'),
			$img, countrys, gageflag;

		countrys = [];
		if ( country == 21 ) {
			//第二組
			$img = $ul.slice( 2, 4 ).find('LI IMG');
		}
		else {
			//第一組
			$img = $ul.slice( 0, 2 ).find('LI IMG');
		}
		$img.each(function() {
			countrys.push( $(this).attr('title') );
		});

		//マップの勢力と同じ場合、ゲージ情報も取得
		if ( countrys[ 0 ] == name ) { gageflag = true; }

		$map.find('A[href^="/map.php"]').each(function( idx ) {
			var $this = $(this),
				point = $this.attr('href').match(/x=(-?\d+)&y=(-?\d+)/),
				name = countrys[ Math.floor( idx / 6 ) ],
				gage = ( $this.parent().prev().find('IMG').attr('src').match(/_gauge_(\d+).png/) || [,0] )[1].toInt(),
				data;

			if ( idx % 6 == 0 ) {
				//大殿
				data = { name: name, x: point[1].toInt(), y: point[2].toInt(), color: '#f00' };
			}
			else {
				//砦
				data = { name: name, x: point[1].toInt(), y: point[2].toInt(), color: '#fff' };
			}

			if ( gageflag ) { data.gage = gage; }

			list.push( data );
		});
	});

	return list;
},

//. getFee
getFee: function( price ) {
	var fee = 0;

	if ( price <= 500 ) {
		fee = Math.floor( price * 0.1 );
	}
	else if ( price <= 1000 ) {
		fee = Math.floor( price * 0.2 ) - 50;
	}
	else {
		fee = Math.floor( price * 0.3 ) - 150;
	}

	return fee;
},

//. getDistance
getDistance: function( point1, point2 ) {
	if ( typeof( point1 ) == 'string' ) {
		point1 = point1.replace(/[\(\) ]/g, '').match(/(-?\d+),(-?\d+)/);
		if ( point1 == null ) {
			point1 = { x: 0, y: 0 };
		}
		else {
			point1 = { x: point1[1].toInt(), y: point1[2].toInt() };
		}
	}
	if ( typeof( point2 ) == 'string' ) {
		point2 = point2.replace(/[\(\) ]/g, '').match(/(-?\d+),(-?\d+)/);
		if ( point2 == null ) {
			point2 = { x: 0, y: 0 };
		}
		else {
			point2 = { x: point2[1].toInt(), y: point2[2].toInt() };
		}
	}

	var x = Math.pow( point2.x - point1.x, 2 ),
		y = Math.pow( point2.y - point1.y, 2 ),
		distance = Math.sqrt( x + y );

	return distance;
},

//. getSpeed
getSpeed: function( cards, unitskill ) {
	var speed_list = {}, speed_mod = {}, min_speed = Number.MAX_VALUE;

	for ( var i = 0, len = cards.length; i < len; i++ ) {
		var card = cards[ i ];

		data = Soldier.getByName( card.solName );
		if ( !data ) { return 0; }

		if ( !speed_list[ data.skillType ] ) {
			speed_list[ data.skillType ] = data.speed;
		}
		else if ( data.speed < speed_list[ data.skillType ] ) {
			speed_list[ data.skillType ] = data.speed;
		}

		$.each( card.speedModify, function( key, value ) {
			if ( !speed_mod[ key ] ) { speed_mod[ key ] = 0; }
			speed_mod[ key ] += value;
		});
	}

	$.each( speed_list, function( key, value ) {
		var mod = 100, speed;

		if ( speed_mod[ key ] ) { mod += speed_mod[ key ]; }
		if ( speed_mod[ '全' ] ) { mod += speed_mod[ '全' ]; }

		speed = value * mod / 100;

		if ( speed < min_speed ) { min_speed = speed; }
	});

	if ( min_speed === Number.MAX_VALUE ) {
		min_speed = 0;
	}

	if ( unitskill ) {
		min_speed = min_speed * ( 100 + unitskill ) / 100;
	}

	return min_speed;
},

//. getNpcPower
getNpcPower: function( rank, materials ) {
	var npc = Data.npcPower || Data.getNpcPower();

	return npc[ rank + '-' + materials ];
},

//. getNext20Exp
getNext20Exp: function( rank, exp ) {
	var next20 = [ 20546, 134144, 408474, 906404, 1766164, 3163879 ][ rank ];

	return next20 - exp;
},

//. getSkillCandidate
getSkillCandidate: function( skill_list ) {
	var list = [], list_s1 = [],
		[ skill1, skill2, skill3 ] = skill_list,
		skill, s1, s2, s2_s1;

	skill = Data.skillTable[ skill1.name ];
	if ( skill ) {
		list.push( skill[ 0 ] || '不明Ａ' );
		list.push( skill[ 1 ] || '不明Ｂ' );
		list.push( skill[ 2 ] || '不明Ｃ' );
		s1 = skill[ 3 ] || '不明Ｓ１';
		s2 = skill[ 4 ] || '不明Ｓ２';
	}
	else {
		list.push( '不明Ａ' );
		list.push( '不明Ｂ' );
		list.push( '不明Ｃ' );
		s1 = '不明Ｓ１';
		s2 = '不明Ｓ２';
	}

	if ( skill2 ) {
		skill = Data.skillTable[ skill2.name ];
		if ( skill ) {
			list.push( skill[ 3 ] || '不明Ｓ１' );
		}
	}
	if ( skill3 ) {
		skill = Data.skillTable[ skill3.name ];
		if ( skill ) {
			list.push( skill[ 3 ] || '不明Ｓ１' );
		}
	}

	list = list.slice( -3 );
	list.push( s1 );
	list = list.unique();

	//候補のs1を取得
	list.forEach(function( value ) {
		var skill = Data.skillTable[ value ];
		if ( skill ) {
			list_s1.push( skill[ 3 ] || '不明Ｓ１' );
		}
		else {
			list_s1.push( '不明Ｓ１' );
		}
	});

	skill = Data.skillTable[ s2 ];
	if ( skill ) {
		s2_s1 = skill[ 3 ] || '不明Ｓ１';
	}
	else {
		s2_s1 = '不明Ｓ１';
	}

	return { table: list, table_s1: list_s1, s2: s2, s2_s1: s2_s1 };
},

//. getConsumption
getConsumption: function( materials, number ) {
	var modRate = 1, idx;

	if ( number >= 5 ) {
		idx = Math.floor( number / 10 );
		if ( idx > 10 ) { idx = 10; }

		modRate = [ 0.98, 0.96, 0.94, 0.94, 0.94, 0.92, 0.92, 0.92, 0.92, 0.92, 0.90 ][ idx ];
	}

	return materials.map(function( value ) {
		return ( value * modRate ).toRound( 0 ) * number;
	});
},

//. searchTradeCardNo
searchTradeCardNo: function( card_no ) {
	location.href = '/card/trade.php?t=no&k=' + card_no + '&s=price&o=a';
},

//. searchTradeSkill
searchTradeSkill: function( name ) {
	name = encodeURIComponent( name );
	location.href = '/card/trade.php?t=skill&k=' + name + '&s=price&o=a';
},

//. keyBindCallback
keyBindCallback: function( callback ) {
	return function( key, event ) {
		var tag = event.target.tagName.toUpperCase();

		if ( tag == 'INPUT' || tag == 'TEXTAREA' ) {
			return true;
		}

		if ( $.isFunction( callback ) ) {
			return callback.call( null, key, event );
		}
	}
},

//. keyBindCommon
keyBindCommon: function() {

	$(document).keybind({
		'm': Util.keyBindCallback(function() {
			location.href = '/map.php';
		}),

		'1': Util.keyBindCallback(function() {
			location.href = '/card/deck.php?ano=0';
		}),

		'2': Util.keyBindCallback(function() {
			location.href = '/card/deck.php?ano=1';
		}),

		'3': Util.keyBindCallback(function() {
			location.href = '/card/deck.php?ano=2';
		}),

		'4': Util.keyBindCallback(function() {
			location.href = '/card/deck.php?ano=3';
		}),

		'5': Util.keyBindCallback(function() {
			location.href = '/card/deck.php?ano=4';
		}),

		't': Util.keyBindCallback(function() {
			location.href = '/card/trade.php?t=name&k=&s=no&o=a';
		})
	});
},

//. keyBindPager
keyBindPager: function() {
	var in_process = false;

	$(document).keybind({
		'a': Util.keyBindCallback(function() {
			var $a = $('UL.pager LI:first A:last');

			if ( $a.length == 1 && !in_process ) {
				in_process = true;
				location.href = $a.attr('href');
			}

			return false;
		}),

		'd': Util.keyBindCallback(function() {
			var $a = $('UL.pager LI:last A:first');

			if ( $a.length == 1 && !in_process ) {
				in_process = true;
				location.href = $a.attr('href');
			}

			return false;
		})
	});
},

//. keyBindMap
keyBindMap: function() {
	$(document).keybind({
		'w': Util.keyBindCallback(function() {
			$('#ig_cur01_w').click();
		}),

		'd': Util.keyBindCallback(function() {
			$('#ig_cur02_w').click();
		}),

		's': Util.keyBindCallback(function() {
			$('#ig_cur03_w').click();
		}),

		'a': Util.keyBindCallback(function() {
			$('#ig_cur04_w').click();
		})
	});
},

//. wait
wait: function( ms ) {
	var dfd = $.Deferred();
	setTimeout( function() { dfd.resolve(); }, ms );
	return dfd;
},

//. enter
enter: function() { $(this).addClass('imc_current'); },
//. leave
leave: function() { $(this).removeClass('imc_current'); },

//. tb_init
tb_init: unsafeWindow.tb_init = function( a ) {
	$( document ).on('click', a, function () {
		var c = this.title || this.name || null;
		var b = this.href || this.alt;
		var d = this.rel || false;

		Util.tb_show( c, b, d );

		this.blur();
		return false;
	});
},

//. tb_show
tb_show: function( j, b, h ) {
	var $tb, margintop;

	unsafeWindow.tb_show( j, b, h );

	//カードウィンドウチェック
	if ( b.indexOf('cardWindow') == -1 ) { return; }

	$tb = $('#TB_ajaxContent');

	//微調整
	$tb.css({ height: 'auto' });
	margintop = -Math.floor( $('#TB_window').height() / 2 - 20 );
	if ( margintop < -350 ) { margintop = -350; }
	$('#TB_window').css({ marginTop: margintop });

	if ( $tb.find('.imc_table').length > 0 ) { return; }

	var card = new LargeCard( $tb ),
		list = [], type, html, html2, $table;

	//仮想の兵数セット
	card.solNum = card.maxSolNum;

	type = '長槍足軽 武士 国人衆 長弓兵 弓騎馬 海賊衆 精鋭騎馬 赤備え 母衣衆 騎馬鉄砲 雑賀衆 鉄砲足軽'.split(' ');
	$.each( type, function( idx, key ) {
		//仮想の兵種セット
		card.solName = key;
		card.power();

		list.push({
			solName: card.solName,
			atk: Math.floor( card.totalAtk ),
			def: Math.floor( card.totalDef ),
			costDef: Math.floor( card.totalDef / card.cost )
		});
	})

	html = '<table class="imc_table td_right" style="width: 483px; margin: 0px;">' +
		'<tr><th width="14%">兵種</th><th width="12%">攻撃力</th><th width="12%">防御力</th><th width="12%">防御力<BR/>/ Cost</th>' +
		'<th width="14%">兵種</th><th width="12%">攻撃力</th><th width="12%">防御力</th><th width="12%">防御力<BR/>/ Cost</th></tr>';

	for ( var i = 0, len = Math.ceil( list.length / 2 ); i < len; i++ ) {
		var left = list[ i ],
			right = list[ len + i ];

		html += '<tr>';

		html += '<th>' + left.solName + '</th>' +
			'<td>' + left.atk.toFormatNumber() + '</td>' +
			'<td>' + left.def.toFormatNumber() + '</td>' +
			'<td>' + left.costDef.toFormatNumber() + '</td>';

		if ( right ) {
			html += '<th>' + right.solName + '</th>' +
				'<td>' + right.atk.toFormatNumber() + '</td>' +
				'<td>' + right.def.toFormatNumber() + '</td>' +
				'<td>' + right.costDef.toFormatNumber() + '</td>';
		}
		else {
			html += '<td colspan="4"></td>';
		}

		html += '</tr>';
	}

	html += '</table>';

	//スキル候補
	var { table, table_s1, s2, s2_s1 } = Util.getSkillCandidate( card.skillList );
	html += '<table class="imc_table" style="width: 483px; margin: 0px;">' +
		'<tr>' +
			'<th width="20%">候補Ａ</th>' +
			'<th width="20%">候補Ｂ</th>' +
			'<th width="20%">候補Ｃ</th>' +
			'<th width="20%">候補Ｄ</th>' +
			'<th width="20%">Ｓ２</th>' +
		'</tr>' +
		'<tr>';
	html2 = '';

	for ( var i = 0, len = table.length; i < len; i++ ) {
		html  += '<td>' + table[ i ] + '</td>';
		html2 += '<td>' + table_s1[ i ] + '</td>';
	}
	for ( var i = table.length; i < 4; i++ ) {
		html  += '<td>-</td>';
		html2 += '<td>-</td>';
	}

	html  += '<td>' + ( ( s2 ) ? s2 : '-' ) + '</td>';
	html2 += '<td>' + ( ( s2_s1 ) ? s2_s1 : '-' ) + '</td>';

	html += '</tr><tr>' + html2 + '</tr>';
	html += '</table>';

	$table = $( html ).appendTo( $tb );
	$table.find('TR').filter(':even').css({ backgroundColor: '#eee' });

	margintop = -Math.floor( $('#TB_window').height() / 2 - 20 );
	if ( margintop < -350 ) { margintop = -350; }
	$('#TB_window').css({ marginTop: margintop });

	$tb.find('IMG[src$="nouryoku_title_white.png"]').parent().remove();
	$tb.find('#trade_btn').css('padding-bottom', '10px');
	$tb.find('#table_posi').css('background-color', '#000');

	if ( card.rarity == '雅' ) {
		$tb.find('.ig_card_cost').removeClass('ig_card_cost').addClass('ig_card_cost_over');
	}
},

//. countDown
countDown: (function() {

var EventListener = new Object(),
	countdown_list, timer;

//.. init
function init() {
	countdown_list = [];

	$('.imc_countdown').each(function() {
		var $this = $(this);

		countdown_list.push({
			target:  $this,
			display: $this.find('.imc_countdown_display')
		});
	});
}

//.. start
function start() {
	var now = Util.getServerTime(),
		event_list = {};

	countdown_list = $.map( countdown_list, function( countdown ) {
		var $this = countdown.target,
			{ endtime, alert, alertevent, finishevent } = $this.data(),
			sec = endtime - now;

		if ( sec < 0 ) { sec = 0; }

		if ( countdown.display ) {
			countdown.display.text( sec.toFormatTime() );
		}

		if ( sec == 0 ) {
			if ( !$this.hasClass('imc_countdown_finish') ) {
				$this.addClass('imc_countdown_alert imc_countdown_finish');

				if ( finishevent ) {
					if ( !event_list[ finishevent ] ) { event_list[ finishevent ] = []; };
					event_list[ finishevent ].push( $this );
				}
			}

			return null;
		}

		alert = alert || -1;
		if ( sec <= alert ) {
			if ( !$this.hasClass('imc_countdown_alert') ) {
				$this.addClass('imc_countdown_alert');

				if ( alertevent ) {
					if ( !event_list[ alertevent ] ) { event_list[ alertevent ] = []; };
					event_list[ alertevent ].push( $this );
				}
			}
		}

		return countdown;
	});

	//event fire
	$.each( event_list, function( key ) { $(EventListener).trigger( key, event_list[ key ] ); } );

	timer = setTimeout( arguments.callee, 1000 );
}

$(EventListener)
.on('buildfinish', function() {
	var list = Array.prototype.slice.call( arguments, 1 ),
		html = '<ul><li>建設が完了しました。</li><li><ul>';

	list.forEach(function( $elem ) {
		html += '<li>' + $elem.data('message') + '</li>';
	});

	html += '</ul></li></ul>';

	Display.info( html, true );
})
.on('breakfinish', function() {
	var list = Array.prototype.slice.call( arguments, 1 ),
		html = '<ul><li>削除が完了しました。</li><li><ul>';

	list.forEach(function( $elem ) {
		html += '<li>' + $elem.data('message') + '</li>';
	});

	html += '</ul></li></ul>';

	Display.info( html, true );
})
.on('trainingfinish', function() {
	var list = Array.prototype.slice.call( arguments, 1 ),
		html = '<ul><li>訓練が完了しました。</li><li><ul>';

	list.forEach(function( $elem ) {
		html += '<li>' + $elem.data('message') + '</li>';
	});

	html += '</ul></li></ul>';

	Display.info( html, true );
})
.on('actionfinish', function() {
	var list = Array.prototype.slice.call( arguments, 1 ),
		html = '<ul><li>部隊の行動が完了しました。</li><li><ul>';

	list.forEach(function( $elem ) {
		html += '<li>' + $elem.data('message') + '</li>';
	});

	html += '</ul></li></ul>';

	Display.info( html, true );

	//部隊情報更新
	Util.getUnitStatusDelay();
})
.on('actionrefresh', function() {
	//部隊情報更新
	Util.getUnitStatusDelay();
})
.on('recoveryfinish', function() {
	var list = Array.prototype.slice.call( arguments, 1 ),
		html = '<ul><li>武将のHPが全快しました。</li><li><ul>';

	list.forEach(function( $elem ) {
		html += '<li>' + $elem.data('message') + '</li>';
	});

	html += '</ul></li></ul>';

	Display.info( html, true );
})
.on('raidlistupdate', function() {
	setTimeout( function() { $('#imi_raid_list').trigger('update'); }, 1000 );
})
.on('raidlistupdate2', function() {
	setTimeout( function() {
		$('#imi_raid_list').trigger('update');

		if ( Data.sounds.enemy_raid ) {
			//アラーム
			var audio = new Audio( Data.sounds.enemy_raid );
			audio.volume = 0.6;
			audio.play();
		}
	}, 1000 );
})
.on('sessionalert', function() {
	Display.alert('まもなくセッションタイムアウトします。');
})
.on('sessiontimeout', function() {
	Display.alert('セッションタイムアウトしました。<br/>再ログインしてください。');
});

//.. return
return function() {
	if ( timer ) { clearTimeout( timer ); }
	init();
	start();
};

})()

};

//■ Display
var Display = (function() {

var $sysmessage;

function Dialog( options ) {
	var $overlay = $('<div id="imi_overlay"><div class="imc_overlay" /><div id="imi_dialog_container" /></div>'),
		$container = $overlay.find('#imi_dialog_container'),
		self = this,
		$body, $footer;

	options = $.extend( { width: 500, height: 200, top: '25%' }, options );

	$overlay.appendTo('BODY');

	if ( options.title ) {
		$container.append('<div class="imc_dialog_header">' + options.title + '</div>');
	}

	$body = $('<div class="imc_dialog_body" />');
	$container.append( $body );

	if ( options.content ) {
		$body.append( options.content );
	}

	if ( options.buttons ) {
		$footer = $('<div class="imc_dialog_footer" />');
		$.each( options.buttons, function( key, callback ) {
			$footer.append(
				$('<button/>').text( key ).click(function() {
					if ( !$(this).attr('disabled') ) { callback.call( self ); }
				})
			);
		});
		$container.append( $footer );
		this.buttons = $footer.find('BUTTON');
	}

	$container.css('top', options.top);
	$container.css('width', options.width);
	$body.css('height', options.height);

	this.append = function() {
		$body.append( arguments[ 0 ] );
	}

	this.message = function( text ) {
		var $div = $('<div class="imc_message">' + text + '</div>');

		$body.append( $div );
		$div.get( 0 ).scrollIntoView();

		return this;
	}

	this.close = function() {
		$overlay.remove();
	}

	return this;
}

function show( msg, sound, timeout, cssClass ) {
	if ( !$sysmessage ) {
		$sysmessage = $('<div class="imc_dialog" />').appendTo( document.body );
	}

	var $span = $('<span/>').addClass('imc_dialog_content').addClass( cssClass ).html( msg ).appendTo( document.body );
	$span.width( $span.outerWidth() ).css('display', 'block').appendTo( $sysmessage );

	timeout = timeout || 3000;
	setTimeout(function() { remove( $span ); }, timeout);

	if ( sound && Data.sounds.info ) {
		var audio = new Audio( Data.sounds.info );
		audio.volume = 0.6;
		audio.play();
	}
}

function remove( $span ) {
	$span.remove();

	if ( $sysmessage.children().length == 0 ) {
		$sysmessage.remove();
		$sysmessage = null;
	}
}

//. return
return {
	info: function( msg, sound, timeout ) {
		show( msg, sound, timeout, 'imc_infomation' );
	},
	alert: function( msg, sound, timeout ) {
		sound = ( sound === undefined ) ? true : sound;
		show( msg, sound, timeout, 'imc_alert' );
	},
	dialog: function( options ) {
		return new Dialog( options );
	}
}

})();

//■ Soldier
var Soldier = (function() {

var data = {
	//槍
	'足軽':     { type: 321, class: 'yari1', attack: 11, defend: 11, speed: 15, destroy:  2, command: '槍', skillType: '槍', training: 150, dou:   0, require: ['槍', '槍']},
	'長槍足軽': { type: 322, class: 'yari2', attack: 16, defend: 16, speed: 16, destroy:  2, command: '槍', skillType: '槍', training: 165, dou:  10, require: ['槍', '槍']},
	'武士':     { type: 323, class: 'yari3', attack: 18, defend: 18, speed: 18, destroy:  2, command: '槍', skillType: '槍', training: 180, dou: 200, require: ['槍', '弓']},
	'国人衆':   { type: 324, class: 'yari4', attack: 17, defend: 13, speed: 17, destroy:  3, command: '槍', skillType: '槍', training:   0, dou:   0, require: ['槍', '槍']},
	//弓
	'弓足軽':   { type: 325, class: 'yumi1', attack: 10, defend: 12, speed: 16, destroy:  1, command: '弓', skillType: '弓', training: 155, dou:   0, require: ['弓', '弓']},
	'長弓兵':   { type: 326, class: 'yumi2', attack: 15, defend: 17, speed: 18, destroy:  1, command: '弓', skillType: '弓', training: 170, dou:  10, require: ['弓', '弓']},
	'弓騎馬':   { type: 327, class: 'yumi3', attack: 17, defend: 19, speed: 23, destroy:  1, command: '弓', skillType: '弓', training: 185, dou: 200, require: ['弓', '馬']},
	'海賊衆':   { type: 328, class: 'yumi4', attack: 16, defend: 17, speed: 20, destroy:  2, command: '弓', skillType: '弓', training:   0, dou:   0, require: ['弓', '弓']},
	//馬
	'騎馬兵':   { type: 329, class: 'kiba1', attack: 12, defend: 10, speed: 22, destroy:  1, command: '馬', skillType: '馬', training: 160, dou:   0, require: ['馬', '馬']},
	'精鋭騎馬': { type: 330, class: 'kiba2', attack: 17, defend: 15, speed: 23, destroy:  1, command: '馬', skillType: '馬', training: 175, dou:  10, require: ['馬', '馬']},
	'赤備え':   { type: 331, class: 'kiba3', attack: 21, defend: 20, speed: 25, destroy:  1, command: '馬', skillType: '馬', training: 190, dou: 200, require: ['馬', '槍']},
	'母衣衆':   { type: 332, class: 'kiba4', attack: 19, defend: 16, speed: 24, destroy:  2, command: '馬', skillType: '馬', training:   0, dou:   0, require: ['馬', '馬']},
	//器
	'破城鎚':   { type: 333, class: 'heiki1', attack:  3, defend:  8, speed:  8, destroy: 10, command: '器', skillType: '器', training: 255, dou:  10, require: ['器', '器']},
	'攻城櫓':   { type: 334, class: 'heiki2', attack: 14, defend:  5, speed: 10, destroy:  7, command: '器', skillType: '器', training: 255, dou:  10, require: ['器', '器']},
	'大筒兵':   { type: 335, class: 'heiki3', attack: 10, defend: 12, speed:  8, destroy:  8, command: '器', skillType: '器', training: 330, dou: 300, require: ['弓', '器']},
	'鉄砲足軽': { type: 336, class: 'heiki4', attack: 18, defend: 26, speed: 15, destroy:  1, command: '器', skillType: '砲', training: 240, dou:  10, require: ['槍', '器']},
	'騎馬鉄砲': { type: 337, class: 'heiki5', attack: 26, defend: 18, speed: 21, destroy:  1, command: '器', skillType: '砲', training: 310, dou: 300, require: ['馬', '器']},
	'雑賀衆':   { type: 338, class: 'heiki6', attack: 23, defend: 17, speed: 18, destroy:  5, command: '器', skillType: '砲', training:   0, dou:   0, require: ['槍', '器']},
	//NPC用
	'浪人':     { defend:  12, command: '槍' },
	'抜け忍':   { defend:  12, command: '弓' },
	'野盗':     { defend:  12, command: '馬' },
	'農民':     { defend:   5, command: '他' },
	'鬼':       { defend:  88, command: '他' },
	'天狗':     { defend: 112, command: '他' }
};

var rankRate = {
	'SSS': 120,
	'SS': 115,
	'S': 110,
	'A': 105,
	'B': 100,
	'C': 95,
	'D': 90,
	'E': 85,
	'F': 80
};

function Soldier() { return $.extend( {}, data ); }

$.extend( Soldier, {

nameKeys: {},
typeKeys: {},
classKeys: {},

//. getByName
getByName: function( name ) {
	name = ( name == '鉄砲騎馬') ? '騎馬鉄砲' : name;
	return data[ name ];
},
//. getByType
getByType: function( type ) {
	var name = Soldier.typeKeys[ type ];

	return this.getByName( name );
},
//. getByClass
getByClass: function( className ) {
	var name = this.getNameByClass( className );

	return this.getByName( name );
},
//. getNameByType
getNameByType: function( type ) {
	return Soldier.typeKeys[ type ] || '';
},
//. getNameByClass
getNameByClass: function( className ) {
	className = (className.split('_') || [])[1];
	return Soldier.classKeys[ className ] || '';
},
//. getType
getType: function( name ) {
	return Soldier.nameKeys[ name ] || null;
},
//. modify
modify: function( name, commands ) {
	var data = Soldier.getByName( name ),
		modRate = 0;

	if ( !data ) return 0;

	modRate += rankRate[ commands[ data.require[0] ] ];
	modRate += rankRate[ commands[ data.require[1] ] ];

	return modRate / 2;
}

});

$.each( data, function( key, value ) {
	Soldier.nameKeys[ key ] = value.type;
	Soldier.typeKeys[ value.type ] = key;
	Soldier.classKeys[ value.class ] = key;
});

return Soldier;

})();

//■ Data
var Data = {

//. style
style: '' +
/* ajax用 */
'.imc_ajax_load { position: fixed; top: 0px; left: 0px; padding: 2px; background-color: #fff; border-right: solid 3px #999; border-bottom: solid 3px #999; border-bottom-right-radius: 5px; z-index: 3001; }' +

/* お知らせダイアログ用 */
'.imc_dialog { position: fixed; top: 145px; left: 0px; width: 100%; height: 0px; z-index: 3000; }' +
'.imc_dialog_content { min-width: 300px; font-size: 1.2em; color: Black; font-weight: bold; text-align: center; padding: 10px 20px; margin: 3px auto; border-radius: 10px; }' +
'.imc_dialog_content { box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.7), 3px 3px 4px rgba(0, 0, 0, 0.7); }' +
'.imc_dialog_content UL { display: inline-block; }' +
'.imc_dialog_content LI { text-align: left; }' +
'.imc_dialog_content.imc_infomation { border: solid 2px #06f; background-color: #eff; }' +
'.imc_dialog_content.imc_alert { border: solid 2px #c00; background-color: #fee; }' +

/* overlay用 z-index: 2000 */
'#imi_overlay { position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 2000; }' +
'#imi_overlay .imc_overlay { position: absolute; width: 100%; height: 100%; background-color: #000; opacity: 0.75; }' +

/* ダイアログメッセージ用 */
'#imi_dialog_container { position: relative; margin: auto; width: 500px; height: auto; background-color: #f1f0dc; border: solid 2px #666; overflow: hidden; }' +
'#imi_dialog_container .imc_dialog_header { background-color: #ccc; padding: 8px; font-weight: bold; }' +
'#imi_dialog_container .imc_dialog_body { margin: 10px 0px 10px 10px; padding-right: 10px; font-size: 12px; height: 200px; overflow: auto; }' +
'#imi_dialog_container .imc_dialog_footer { margin: 5px; padding: 5px 10px; border-top: solid 1px black; text-align: right; }' +
'#imi_dialog_container .imc_message { margin: 4px; }' +
'#imi_dialog_container BUTTON { margin-left: 8px; padding: 5px; min-width: 60px; border: solid 1px #999; border-radius: 3px; cursor: pointer; color: #000; background: -moz-linear-gradient(top, #fff, #ccc); box-shadow: 1px 1px 2px #ccc; }' +
'#imi_dialog_container BUTTON:hover { background: -moz-linear-gradient(bottom, #fff, #ccc); }' +
'#imi_dialog_container BUTTON:active { border-style: inset; }' +
'#imi_dialog_container BUTTON:disabled { color: #666; border-style: solid; background: none; background-color: #ccc; cursor: default; }' +

/* コンテキストメニュー用 z-index: 9999 */
'.imc_menulist { position: absolute; padding: 2px; min-width: 120px; font-size: 12px; color: #fff; background: #000; border: solid 1px #b8860b; z-index: 9999; -moz-user-select: none; }' +
'.imc_menutitle { background: -moz-linear-gradient(left, #a82, #420); color: #eee; margin: 2px -2px 2px -2px; padding: 4px 8px; font-size: 13px; font-weight: bold; min-width: 120px; }' +
'.imc_menulist > .imc_menutitle:first-child { margin: -2px -2px 2px -2px; }' +
'.imc_menuitem { margin: 0px; padding: 4px 20px 4px 8px; white-space: nowrap; cursor: pointer; border-radius: 2px; }' +
'.imc_separater { border-top: groove 2px #ffffff; margin: 3px 5px; cursor: default; }' +
'.imc_nothing { margin: 0px; padding: 3px 8px; color: #666; cursor: default; }' +
'.imc_menuitem:hover { color: #000; background: #ccc; }' +
'.imc_menuitem > .imc_submenu { visibility: hidden; }' +
'.imc_menuitem:hover > .imc_submenu { visibility: visible; }' +
'.imc_submenu { position: absolute; left: 100%; margin: -7px 0px 0px -2px; }' +
'.imc_submenu_mark { position: absolute; left: 100%; margin-left: -10px; font-size: 14px; }' +

/* 下部表示欄 z-index: 99 */
'#imi_bottom_container { position: fixed; bottom: 0px; left: 0px; width: 100%; height: auto; border-bottom: solid 2px #000; z-index: 99; }' +
'#imi_bottom_container .imc_overlay { position: absolute; width: 100%; height: 100%; background-color: #000; opacity: 0.75; }' +

/* コマンド群 */
'.imc_command_selecter { height: 22px; margin: 0px 0px 2px 0px; }' +
'.imc_command_selecter LI { float: left; width: 65px; height: 20px; line-height: 20px; text-align: center; border: solid 1px #666; color: #666; background-color: #000; margin-right: 8px; cursor: pointer; }' +
'.imc_command_selecter LI.imc_selected { background-color: #666; border-color: #fff; color: #fff; }' +
'.imc_command_selecter LI:hover { background-color: #666; border-color: #fff; color: #fff; }' +
'.imc_command_selecter LABEL { float: left; width: 65px; height: 20px; margin-right: 8px; line-height: 20px; text-align: center; font-weight: bold; color: #76601D; border: solid 1px #76601D; background-color: #E0DCC1; }' +

/* 募集・チャット用 */
'#commentBody TD { height: 13px; }' +
'#commentBody #chatComment TABLE TD.al { width: 105px; }' +
'#commentBody #chatComment TABLE TD.al A { width: 105px; }' +
'#commentBody #chatComment TABLE TD.msg > SPAN { width: 235px; }' +
'.imc_coord { display: inline !important; cursor: pointer; font-weight: bold; }' +
'SPAN.imc_coord:hover { background-color: #f9dea1 !important; }' +

/* ステータスバー用 */
'#status { padding: 6px 5px 5px 5px; }' +
'#status_left { width: 930px; }' +
'#status_left UL LI { padding: 0px 3px; border: none; }' +
'#status_left UL LI.sep { border-right: solid 1px #999; }' +
'#status_left .money_b,' +
'#status_left .money_c { display: inline; margin-left: 2px; background-position: 0px 3px; }' +
'.imc_outer_bar { background: -moz-linear-gradient(left, #000, #444); border: solid 1px #666; width: auto; display: inline-block; border-radius: 2px; }' +
'.imc_outer_bar.imc_alert { background: none; background-color: #c99; border: solid 1px #c99; }' +
'.imc_outer_bar.imc_overflow { background: none; background-color: #f99; border: solid 1px #f99; color: #f99; }' +
'.imc_inner_bar { display: inline-block; }' +
'.imc_inner_bar.imc_wood  { background-color: #642; }' +
'.imc_inner_bar.imc_stone { background-color: #264; }' +
'.imc_inner_bar.imc_iron  { background-color: #646; }' +
'.imc_inner_bar.imc_rice  { background-color: #662; }' +
'.imc_bar_contents { margin: 2px 4px; display: inline-block; }' +

/* プルダウンメニュー用 z-index: 2000 */
'#gnavi { height: 33px; }' +
'#gnavi .imc_pulldown { position: absolute; min-width: 130px; background-color: #000; border: solid 1px #b8860b; z-index: 2000; display: none; white-space: nowrap; }' +
'#gnavi .imc_pulldown A.imc_pulldown_item { margin: 10px; text-indent: 0px; width: auto !important; height: 15px; color: #fff; background: #000 none; }' +
/* プルダウンメニュー微調整用 */
'#mapbox,' +
'#ig_deckbox,' +
'#ig_mapbox,' +
'#ig_mainareabox,' +
'#ig_battlebox { margin-top: 2px; }' +
'#ig_boxInner_japanmap { padding: 0px !important; width: 936px !important; }' +
'#ig_battle_mainmenu { position: relative; top: 5px; margin-bottom: 15px; }' +

/* ポップアップ用 */
'#TB_title { height: auto; }' +
'#TB_closeAjaxWindow { padding-top: 10px; }' +

/* サイドバー微調整用 */
'#ig_boxInner_battle { margin-bottom: 5px; padding: 0px !important; width: 936px !important; }' +

/* 武将名 */
'.ig_card_name { font-family: "ＭＳ 明朝"; }' +
/* 統率微調整用 */
'.lv_sss, .graylv_sss { background-position:    0px 0px; width: 33px; }' +
'.lv_ss, .graylv_ss { background-position:  -35px 0px; width: 28px; }' +
'.lv_s, .graylv_s { background-position:  -65px 0px; width: 19px; }' +
'.lv_a, .graylv_a { background-position:  -86px 0px; width: 19px; }' +
'.lv_b, .graylv_b { background-position: -107px 0px; width: 19px; }' +
'.lv_c, .graylv_c { background-position: -128px 0px; width: 17px; }' +
'.lv_d, .graylv_d { background-position: -147px 0px; width: 19px; }' +
'.lv_e, .graylv_e { background-position: -168px 0px; width: 20px; }' +
'.lv_f, .graylv_f { background-position: -190px 0px; width: 17px; }' +

/* カーソル行用 */
'.imc_current { background-color: #f9dea1 !important; }' +

/* テーブルスタイル */
'.imc_table { border-collapse: collapse; border: solid 1px #76601D; }' +
'.imc_table TH { padding: 5px 6px; text-align: center; vertical-align: middle; border-bottom: dotted 1px #76601D; border-left: solid 1px #76601D; color: #300; font-weight: bold; background-color: #E0DCC1; }' +
'.imc_table TD { padding: 4px 5px; text-align: center; vertical-align: middle; border-bottom: dotted 1px #76601D; border-left: solid 1px #76601D; }' +
'.imc_table.td_right TD { text-align: right; }' +

'#TB_window .imc_table { background-color: #fff; color: #000; }' +

/* カウントダウン用 */
'.imc_countdown_alert { }' +
'.imc_countdown_finish { }' +
'.imc_countdown .imc_countdown_display { font-weight: bold; padding: 0px 1px; }' +
'.imc_countdown.imc_countdown_alert .imc_countdown_display { color: #c03; }' +
/* タイムアウト */
( ( Env.chapter >= 5 ) ?
'#header #lordNameBox #lordSiteArea { height: 19px; width: 240px; margin: 4px 2px 0px 0px; padding: 0px 0px 0px 3px; line-height: 19px; }' :
'#header #lordNameBox #lordSiteArea { height: 19px; margin-top: 5px; padding-top: 0px; line-height: 19px; }' ) +
'#lordSiteArea.imc_countdown { background-color: #15b; }' +
'#lordSiteArea.imc_countdown_alert { background-color: #c03; }' +
'#lordSiteArea.imc_countdown_alert .imc_countdown_display { color: #fff; }' +

/* サイドバーカウントダウン用 */
'#imi_basename LI:hover { margin-left: 3px !important; border-left: solid 3px #ff8; }' +
'#imi_basename .imc_side_countdown { line-height: 100% !important; margin: 2px 0px -2px -10px; text-align: right; color: #fff; }' +
'#imi_basename .imc_coord { font-weight: normal; }' +
'#imi_basename .imc_break { color: #999; }' +
'#imi_basename .imc_enemy > :first-child { color: #f66; font-weight: bold; }' +

'#imi_basename .imc_attack  { background-color: #f66; color: #000; padding: 0px 2px; }' +
'#imi_basename .imc_camp    { background-color: #c33; color: #fff; padding: 0px 2px; }' +
'#imi_basename .imc_meeting { background-color: #6cf; color: #000; padding: 0px 2px; }' +
'#imi_basename .imc_backup  { background-color: #09c; color: #fff; padding: 0px 2px; }' +
'#imi_basename .imc_return  { background-color: #ddd; color: #000; padding: 0px 2px; }' +
'#imi_basename .imc_dungeon { background-color: #f96; color: #000; padding: 0px 2px; }' +
'#imi_basename .imc_develop { background-color: #390; color: #fff; padding: 0px 2px; }' +
'#imi_basename .imc_move    { background-color: #93c; color: #fff; padding: 0px 2px; }' +
'#imi_basename .imc_wait    { background-color: #9c3; color: #000; padding: 0px 2px; }' +
'#imi_basename .imc_backup_wait { background-color: #396; color: #fff; padding: 0px 2px; }' +

/* 全体地図用 */
'#imi_mapcontainer { position: relative; color: #000; background-color: #000; border: solid 30px #e0dcc1; }' +
'#imi_mapcontainer CANVAS { position: absolute; top: 0px; left: 0px; }' +
'#imi_mousemap { position: absolute; width: 100%; height: 100%; z-index: 2; }' +
/* 全体地図座標表示用 */
'#imi_label { position: absolute; width: 60px; height: 12px; padding-left: 3px; color: #fff; background-color: #666; border: solid 1px #fff; display: none; z-index: 3; }' +
'',

//. images
images: {
	gofight_mode_camp: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAuCAIAAABGYbvAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjenhJ3MAAAPSElEQVRoQ%2B2baXBW1RnHz%2FtqmlQFIUYIQSY0TGqMVEEq0trpAEoIApEtG0lICElQxBAkCcgWBTQJSxKX4BJoAZ2CSHBrUOmArSW2caw6EkuwWCABR6FT7TjTGful%2Fd3zJIeb%2B953o%2FBFyDxz59xzz%2Fb8z%2F9Zzsm86qmnqpHGxtpnnt2INDXVb936BLJj%2B9Miu3Y%2B75A39%2B2khqdD%2FvReCzU8feXT9nep5GmXE8c%2F4JWnkVNdnyJffvHXM18dQf5xtuPrf372r2%2BOIRQQauQTbaTxyZOfmu4ymmMWmdd1VbJaX0WMgg7FBRDBB6AQAQ30EBUulP5wlAX5Q9MVSgeOoGCgBClQ8wclX0Xs2yBlB45mXl8o7Tg6ABWi%2BHLI0MsXSmB0QrkjPv5JpS4LCOwcnuzKSiGmg5W9oBQbf2N%2BwWUcDQJvNtQbNO2UNDZurLsbSjF14ys39ulzGU1BoPnOMXZiBveVDijfmnUvozToscyTwgUXGV%2BmEAk8RdAGZrQLslRZki%2BUrgbuEnbg5qu1qy%2FIUr4HgwAlxHLYeBgRHIcKsR18DJER3wP4HCo8OzjO1V0GCjvGV0LgFxeXXSRQ6pVCLtLgF3xYsXFCsaAZwFe6JEOSolt94uM3KoWwPntBXv09gWmD7au9TC%2B%2Brldqk35SDjCOjG9v49qe8et6z2jGdKwk6Fy%2BGgGiKG6yovDySnPaYStkoNAFxcCoVj%2BlLCIjUMOntUo9qp%2FVukbqXacwI1CwjyavUlOj1OP66RhE5hLxN37oeoEy8cOwMnheaQzcEJOsKPT5BERgqtJIrdOyWqsq%2BvDk9SHluU95Fii1vOeTUdgOGZUAtEYPAuiUGVleGZAanrw%2BrAdkRl4NZALxI0qt0G3sn8w2hK6XtJSs6DxZiZkTvEKcUpBi6YuVKlae%2B5VnkYWXhRoFUEAfdCtVntLEG%2B9PSs67fmCe8izVlWAqJGWEx3QZ%2Falfpts%2FqDw0qFCKcRiNmnL9ypPxc5Q3P%2BqqfN2GvoIUOLKSB5RnnvKUKA9wswFiH7JDiLGVwArS0jg3g2MYrDTXGbBaJma4AE9Wb5Ba%2BfNfrE6ddG9E5L3KOz0i8sl5xenKO195KpVaojyzlaehqPi%2F%2Bu%2Bh20YVKk%2BRFhReqfWnGdsAZHzKVZ6yW24tiL4uS3nn0GDc%2BIK4G6Yq7yzlpSZTedOUt76o%2BPSxzwuHDKUxI7ANYLRKqTKoOnb89hUr5wyIBe4lenvEYpiCBpQF1sCq2b9CrPNkpXSD2IJmAIFQMAIgCqDAuPHAhHo7a2oP%2FGYn5Tc2b06PiMzR0KD8Jg3lnrr6VOWdBi4RUS89Xp0XHQNYIF7c%2F7qC2Li82EG5sXFZsXGHD7V%2BcezzjOiYe5R3b30DHT%2F%2B%2FR9219S%2BXF3L8%2FWnN8uu%2FOe770qHJS5UHrgsXoW9Kb115JmuLuvTiFHZyrtYeWggO8RclAGUZQfVzjQgK%2Fr%2FoKxaFXQygRI7wmYrxt2Fbp1Hjy6bMPG3zzVRRp85CYkTlWei8k5Q3rriEiqbG564W3lTlGeTfv3o4EEoDNEai0s6j3R0dhw92XGUpyD1%2Fltvpygv6FNua2l5eELq8hRL1mVkL580edmE1JUpqUX9Y7B68YwwDqTYtj11Fvqgmdm3X4byYh9lo0bvqqldO31mZkQkOwfoYaFJKDaXbHKjYS7Z%2FCZD9vtKsqJQWAmUbHjFWAvK9kOHQGr%2FjhcoP3D7HYJI4L%2BSoQmztbYQEOAQRpAua9Iz2QOBsrne2gNe71aePfUNHx18Z1Z0DOwWlklEAlBcapryvNpo0farzs7JV0ZOi4jcs35DZ0cHyFK5t64eR4EjFvSD0kUakBU5UssgUJ5LLbWNsxVhQKlZ2d7aisIsevvqKtTOHhKf%2BoOou9UVVNpYeQWVS1NSqZ%2BkPFCSQAGvZ0ZdNUlDSUeBsnzsXYaV%2F%2F72W%2BBATh87Jl9b976C6yQo4SgBRViJw52ivBgHDVZMSaN78%2FoN9ycPZ%2BQVk6dKx0Wjx%2BCRJF5JkuAqjGavb65aFUbYcUBJEkBWFNRXdrOyB8riW0Z81dk15cpIVr9pXjEQbF2xcllK6muaKX9uaQHEF9c%2BRvm58gqYOFdHfEB5YfUjOMTCpJvTYwd3QznuHJQtz2%2FJGBiHpONMb4ivycmb1e866CxhWpIkzJZQlj0wju7fnD078crI1VPSGgoKGXwGDrpvfxmWedk%2F3ILJtwIzRjAleIQBpe8%2FJEzwkeEcTxRg9ShDgBZfiYE3lpYtGDkKjGAHUFL5%2BSeHiUWYpC5%2FQvndPc2i1ZbKpYQCOELcP7T3FWrOnjoF9QJACZoYOw02zi3ED5bq8E3YgWKgQ3q0cLTlWLZXPZoZNwQKE%2FqgPBvG1gpb8T94BmI9oR8VXFUzykpB2rheZ7j7Sl9WcgMqA5nh7AVXKLFKYi5QTlbejRK16xswcIFVykvGWuEe3GmGnqSBFETPxb8cR4Ovz5xB8oclEqDEV4qBdx21glKXliNtbWRIJLPkoeAom5rN64QU2sN9Otbk5OKFcQKwla1tP9RqzdvaSmjCFUga60sRfzVkRYImEkbYMZciENOOpr3MOlCAnNnOSoBoa9lXX1yCnxIohYm%2BrEQx4IaSRK0ZffsJE9MHDMJXzv%2FJiJnR1zMC0d8edhjcyK7aDWVj7iSG4GpJyAg%2BHBOyyA2KiiwrrqjkmTN4CKynnqgN7oAoUAIrUNILFfxp51tPVhTS%2F3Yc%2F3GU0xJP3G24UK4vmMeK5wxLlFCDfyRDMr6SclPlMlEJKFEVKs2%2FZQQ1X544kTFwECZ8prOL%2BJs7NAHPiJfkU8tzTZTFXSIN9y0Q6GsystgJthNcHtJQrsvIop7QJ5BBWwwfdwyUEtnPG0pwIBQ7kiHr6vf48cNG%2BEfo8RPtvFKQsvx3VP4RyG64oumPleXab8KL7qit85hNRTqv1OUl3Y61FbsGCGxQ9LesGBPWli5wUKZSPhFJ8H1dmLm2dGncXFfPCPAOx8fZhhOBeG1rAeUV03W2xDmVc5SdlWLg4bISELBRCx%2Bg03CJ9EDZgyDfBDtB0xT4T6k%2FGw8M5eubnxEoxc0BhCmfPXWa8uE%2FHiIUEEyBcvf6DdQQsux55X0jR4G7BJnmugY2YE1Glhi4bAZ5PrwjpOAlMXAgw13kD00QKLF0zH%2BRrsfAsQDxla8%2B3agTUgv9sAwcKEkwBcpuQHtBabhpY6VBE0CP794WuoEfaXt%2F6jXXvq7t6HcvvChQvtb4TEbs4GfLKyw7fX4LuQ5hp6Pt%2FW1VjxQmJpGm4Gpn97k2PzZuZkQU0OQOHSZY5MYnTFCelyVFb3girU8%2FeDo9%2BvqCHydRsDjb0bHwxmRgAkpO2bAMrsHEtn376PLr5SsYuUyfvjk4sm2ynRxhCf3Ug364UB6tqxZw%2FEApXOWpiWkMXIjpj5LL9MnXEXawO9ycALEuK%2FueH16dMWiwztJ7pei8UsmpEcKWJCbh4FAVQiHwaOHoMWLdxB%2BTosuJc9%2BWrYxP7K6aNmNK1NXYKRaNXQsoLAbUyIfyB8SuSpmUHx3DkZwafCjNChISZWElNw3HQeNAQT8sKHF03XzUWPkYuJ2VPVCec5Tv7RdKApyjwCvrqNAun00WD8U1RHVOHnkMOy%2BRN%2BjfW1t%2FRXegtCCwEkzPusxsehHx7VAyGq%2FzkofLJ%2BI7ftaKV%2FrcslQvjyeYcnakErAINRwQgZJkC6o2PriIvvu376BMDRSWXqJaKE9DSaFdN5Qn2nuFHWGloa4JOGRSZg4KjjJLAUr8uoGSVBGF77GSOCuPw6bIZuQs2Ps6w7rR4BMNcFt0x2Ni6UQG7o3kCI%2F5y5FctkSg5JUjKa9cQeUPHUZin2tl6dYyWAzLkyVxG0QlSThPUJsJdomWT%2BCGJat%2FDGckMk2aiUauYgdXGkBJY7LnoNSAukDpRLM3Je37JgztZeDd1xlWUIYs%2BCxIQSKCJjgsMDKXbLh%2FGhArSJtpgFComZL28YEDL1XXvr1tuxC59Gd34ijJe1qarGSI5JSvbzZtKUpK%2FvDAQfEAdUXFHGYYiiwd6xZrlVVBOgyfwS2PMXIUnuT0347NHRLPYrD3wAHHgGsH9OPKxWKs3TgGZqVxBJIDCSUDiFAAI%2BKQW9lj4FO144MR3PjyPwP2H4cFL%2Br0aae5vgEagh31cIcGPMlUuFicEREFNIIjwR0CylFS%2FjieLx07fpa%2BWs7sHwO%2FpP6Dt%2FfPvaYvI5T3JiZ8ZBlz%2BlzLrSjRpmZ2rtzmkc%2BzMKFwiAKg3EWc%2FOgvLqx0ieBi%2FDYbP%2FXefsdMskV2YUGVGjUc06LbfsqRrq7AOhfDR7E4vooH4EJ7Tdo0GqybkQ5q1FDPV2mDbnShHvKC0d%2Fb2%2FOHxOMfChMSod47u16a86NhfAII4hIbwxQ5A2I%2F%2B%2FBDNoYNyNP3uzKjCDsEZI%2FefsfmufMWJCWDPtxkkex6iDgaPrI8VDaUdGGl08B9oKRzKJvGuqED6wYIqIeS2BTLlRWI86IBrAEIGvAkJjj0oQ018IhBiAnQNrMnmi8fOx6w6IUVM4uwWKbLiIhErF20UVJmZHaxBnqJsFUG7qB6yeLN007Jc1DaDji9fWVvSkJm%2BjOWQSSwmQMWQLB0MR9HL%2BEdTKQBT98GBnEILt5TggYOFxribekFiIbITCdIsUOuADmCDzPSRYwgKI4CotGdglDSnFl6he%2FABo7HFEqGCKWJmyxXtPVdrugmDQLoI23MOBTE5xrjNUw3Lf0BJNw0EiKIMr5RQQr4OntuEwaUQkmyRfv%2B2JflWkY3EX8tgzaQjvZBDPq%2Bw4YyWihtXFdrV5zY60JJW37uJxk6fpgTN5SUCUATCQriRW0QYG8u3rx2raGkMe1gEbz3hRCtyUXJvBAZUQC91ATFQcBOSaevdB4cbXmmJJWcjexkvNQQtOsLmoaSdmI6U3TfZEiuOgwlhZiXsnCPY7xkyFD2JJVQ8lLGzugu3OR20VzruETwXgZuD0P6nLPl5psYQrykcZeXJrh2StovwoOfdqwWu7cZBC9N%2BOxaCyXt%2F1OwX%2BY6Ustzpx3xkuzDZQQFAaxTcDxPA3deZ%2FT8k8fcXZrfzsmPEQOI%2BZ2i%2FMTOn8iPF43ILxpDFEdf%2BRGkQ%2BS3kubHkbIq%2BZWkq4heBkQ7K%2B2%2B0tfGbWdwn7sMR08zuswUGEfzk0%2BjiSuUvliECKL5AWkoaLpCGS6aflP0nmDzP%2BGUWxf1iEhrAAAAAElFTkSuQmCC",
	result_attack: Env.externalFilePath + '/img/gofight/icon_result-attack.png',
	result_defend: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAUCAIAAACcUY36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjenhJ3MAAAMV0lEQVRYR42YiVvVVRrHIcvMaXyaymeatNE0U7OZNPclUp8Ml1xwyRJMkxBzbRlFSsIRMRlRFNBYBFEB2TcREC4Ksu9cuJflsm%2F3ApdF%2Bgvmc37nekW0eeZ5zvN7zj33nPe8y%2FfdjsXvQw1DcjxsYP77UOOjMXze9PsQw%2FyXafJwsH6wv5bv8L%2Bgo5AauZlFuX%2Bwv2ZoUMdP5gN92v7eqgGjZgQR83EzKTb80Z6n75Ir8op%2BY3Vfj5qLnubKQtn3NK%2FP4H7EHQ8H6vp6KnoNZcbuCqkCRWydImEN%2Fz6pER3XG7vLezqLerqK%2B7orFJ4quzuLDO15ho58o6FsxBGFex2LgwO1DBSEmqD8R6KOWIeZgT6N0VAOca7o7izkOASHbzMJ%2Fz%2FNLrXzhDoG%2B7WQ62rJ7mi619mSZWjLQzAug0tE4kpFIyZGuZKL4aC9IaO1Pq2tPo0JZ7tasvjZXHO7tS61s%2Fl%2BT1fRcPlBBwJDp1dfyl%2FdHQWIwQStSatCVhnPRhn2gCXIttalcEWbLh0GFPkf75fCS4Ro%2B3vKjYYio76wV1%2FQqy%2Fk58OBZ2gaCbFee6OqsTpeVxmlU0e31CajBUN7vr4tt6v1AVfyRTsDxmohubEa1tsb0hvUMTUlN2pLQ5k0aRIqc286Lp93eM3SKF8nfnIKOaX8wAdYcUrqt6X2TrM2iS9aQwUQBEeKB%2BE4mhH2lMe5GpPUlEXv%2FXjuhikTHiR5o3QIDse%2FSfiHA1oE1rdmdDbe6Wi4rYw7%2FEQRI%2BSHrtQo7H63bulcC4ud82fWlYU3VsU1aRNrSqMyY73uJ3gz72y6hzD4m7I%2FKyveZ%2BM7E9nPcP1qbW1ZWG3pTV%2Fn3fOes2Tl4o922EffmiMgM1CLiYS%2BGlVV%2BWFoqr4i8tDqJZvfndRQFdOmuwvWujsKe7pKGFzBEWAyLEzoAF2vvqSjMbM8%2B9ruRe9Df8ec6Q1VsR2NKo6Y8WWCfX9PmaFVFXtlTczlzyIuWUf5rLtxdkF%2BirO%2BJaOvu8SMeQACW%2Fq2HExdmRP0yfi%2FQPfL2dNy71z44p%2FvRHgfrS%2B%2F5X%2FSEXm2%2F%2BMdrITxkRxGufWnL9dsmzVl%2FdtvCuF3rdUUBjHSwv89f9RzVuPGxvsf11VGttanYljiCMjC4JG%2BJ1b99dUlL72Yk%2BQVcNKBg9qikPqKCDQLmAECXygDN0SV8vMFwkQQFMQ2rHLQehEHnbauqC25yQq%2BBksSLCbhe%2FVFHY13ws5bNVfHtasD29SB9cUBkd6r2usTutuzB%2FuEmzHAG9gGP1V5122mvSXFqMoLWP3m68zd7Dek3Tq94e03d85%2FLy3sVzgjvMEHNsTlilQB6RFntsyYNNfSojjjUlV%2BQHV%2BIN%2FUm67Rvj%2B67910xnFzYtAprC2g3qhqrkmO8ft59d%2FGA9oYv%2BMnd6%2FjiuWvvKwpDK4pvq6K9Dj77baz%2B7clXz8tUNaSRazBpBIy2Bwc1ZXfqi64uvCF5zkY7nUkOeREXXk4ZgNfbMaQCC8CgNFQDOAzo%2FZmROw3VF%2BpU%2B3Vq70fJDoXpLmw3tuVD%2FgllmAOHErJscniMaNDPQ%2B7O25ys1%2B%2FceqEhS%2BMQoaSTD9iAdcgBrDEMuhr49SJW2e%2BjfCfvz%2FF28lu63uTOQuReZaWGJ8JPz%2BfNbX0%2FjX4JppgYfyCQZjwc%2FlmzcTxC54fFenzQ1Wev8PHc9h%2F7tDnHge2MrkbcZbAKRTdXSEgI4JRHJElKdjls0lvSEfjLN9Fo1%2FISrzYUpcCvggWFmR45Ce26VtV9eXBEV7LdaXBdfcOatMd2jXhsZfXNVZFCOc3FBN7uQAxdsyeLilKcukRbsUZ3stefmnR6Oe%2FX79swahRwD4n%2BSICYHDAjx0IEDbTJ9lM%2B3tGlDunLh21zYh0ux1yIiv%2BrLvDRs6mXHfFpKCU8IlyS%2B8HlN777cL3X1w6aofwd8PdHFd8KDV1eM1i9i8Z%2ByKI8z2%2Bk8UHiedxAQX8pbhYXOAp2w9nSIXKcctbqMzj4BbmW2ZMxvmJQRjfQtYk%2BElPZ2677nZJxqnbwbZNRZ4Vt211Oc75d1xSbth1NqYQ%2FLE8ekX40vtX%2FVztrcb9CVo20yYWpHrZzZshrrG0AP8udqsZWfEeFQ%2BuNqijQa9ICupoJF%2F%2Byp9NOy0sfnP5GoZAjeQPRBSm%2B8hEAHMyNDB2LZiVneC5c97Mj15%2BCWjEBzid%2F27714vfV4T3d7CavfLVccROYXnKhx41XglwoFOS6YuOoPDrvs2AHxeTwm%2Ba9hbgJ6AAE0V4YXxScXlXc1qLNjLax1qTe0kVtDQ9YJ7mgeeNswsJ%2FoR9YgnaImDA3IXvd0jmUAHGDLtwJOzCYZB%2Fw%2BPgDxs%2Big9wXjp2DP9%2BtWAWWQAXgD%2BENyPwx41WuH2cn5MM9aGehxBsx5x3RdaojkdlxaorPsd3snj1lIOD1Zyw84cPWS8S0LUUlx60XsjkhO2nzN2%2B2dSoiSf7wJvCXjYow1mkYxLktcUhYAr5ZeTjS1RG%2BMeWHxrSGQ2FnU0pJRn%2FTgtzKEj8Ntpjoirk07xkl1CP%2BVge2CsAqYE6%2FAHFX%2FfZ7Jj9rvP2T4JO7%2FvGajaqxeGh7rprjf2yD%2FJTzsdcOeb1g60oBBC%2BNHTFq%2BPQuohzBVcxmr%2FrHuk1cX7H7sedUUD0FimN6KWrjEZZSUEnWFw9Yfwp%2B%2FUAgeNsjr581Mdp58ld64QWLC0%2BfeM1kIJzKWmlAq8kJHHd%2FlULBJpmTiY0wqqUX0a%2Byz%2Ftxh5IQfA2wR7v7%2B540FafkBCwqSzjdOLFmXGeU8pVbvF%2BNg2VofqWdGO3KD%2BUcJIJhmP9nf1d7f9l8zFoJLZvnTmZaIxI%2BDBf5MekCYHOXIwxEYkJQEXrpDfS1aHVwghAXYT9PH9gbLJJRSSgFYG6LFyaDkz95%2BA2JmC4PDuwpuQm8hDqlo59UUl7ZMc0SjeyF4PKCuc%2FvHYZ%2B7%2F7bJmUXH5lskBfzNlDaMCQJuGNPaVdzXdzk50ybu3LCrOJdH89K3zzvegj2XEH2nWJPR05FEwU5FDXFIUHnHQE5EvGjEbCzBiPla%2BNI6tD2v%2BXPUiiePIhyS4qJ2jDMYoHtAetF8Nx4Kl9pKhg932EPfNm9idfP6nEyLtYEuMg3rkjX9SWht2LPYfPq%2FNCWFQKngiPAwg%2FBtcF4dgQsUVu7y5XF8TYL5sDMyk3T6eFuQW775eSX%2Fc4ID0Oa0EBdMi66JHwhpKuptSQM3O0BVdLUo6VpB6ruHcu4tKKZk2EMLuheLBfNAm4Sqy%2FqyREOE0K%2BgUObOfMcLD68NSeDXLR7JnMc5K9AWFdWRhOodh2Mf4mQpo6BkcgXpDwJDViOLLBFkEbS2LPrARfXEAAQZtE8SOaAl26KNS1SYfXLUN4KLNOayQ6n%2F4afJgEhu5aRIiNA557lnyA15hjJ7BX514Tea49jyJXFjki2vd1l5Hqwi8sjfBaGe%2B%2FJSFw%2Bw2Phfkpx7ua0nq7CkjySlUrLI9xXHauPWFrXZkTDLvcBDeEHBCYl%2BJDICTPuzvahHoeYYXNStKOA8aKhEuYky8AHhPn7auk5CBcqVvTZe0tvZc6UjR87XnMcWmAKnsHCNrNfW%2Fla69AoaMpU7aDoocTXVA5lQhMkuq5ApDKgC9HhPcxWAUpssJ5XOEJ2IjaXkVJQ8IjvDPRt6iQfLBPI8s74fOdFIKieFJaMUrLTNnAkDZhnaoGHBKrkQSjIaRo3ZQ%2Bh%2FUrJxz8XL%2BV3RUtB%2Fkf1Vz52f7yz1%2FLil0UHkZxl%2ByF%2BnvVpC7R0vbX4HSUbuYGadusqZunT6YXhHhfr1r2%2BaYHAnYaq1GBgE9danbCRUqvDVMnZER5iEKwOYtawNwIyApPGJ%2FextzVoQjau6e7OroopZAowALgDRWKXlDhTKx3FrIuRmsOX6Ij63DGBC0gLVoQfSU9mVHDcXQHCBnmXu2J5mSg1lSuK68gMtdgZwTWlsQWZVyjpIXy8C5Nvpcom3VEKNjAQiRmBuUG%2B1HK8BcRU3n71EuObHrNrzePn3FE%2Faxo13yr6T7a7z4tWePRvxrxYqOgiyMKIEsZbJBNlei3KfsFnmmfWRdO%2BOT7x8hGXbRVWPXRKfqzEf35iOcT8ViiNMXUJiIjGMpHvAWZfP5Zwv%2FhY454hBrWQg4zl%2FmBYeQbg2iwlaeO4dfLRbM6%2Fp8nGuV9Rrx84RSK9p94mXnmY44sftDa05v%2FC6LqzLBeJyTTAAAAAElFTkSuQmCC",
	result_speed: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAUCAIAAACcUY36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAB%2BRJREFUWEfFWPlTU1cURgFxmdqO2lpt1U51OtOxamtrwI3WnYLWpVPL1FK3iopYrNYqTrUqoqAgIgrKqhQwLCKIATQRkC2QBQgkISsJIXlZSYh%2FQb%2F3XsiguP2gceZO5r7k3JvznfOd7Xk9diqd9BpQYv%2FYqRpcQ%2Ffqx04s90%2FP2DgHFAMOGXXJi8ToXyHs6JcO2LudDsWryL8hGS%2Fq3uEavxIGt05Oh9xuE%2FdbOhz9kpfiH3DIbeY2C8EzG1qwgcneELaXXusC%2F0K309Z5whzQGK6DA0k3OuT9FpGpr8moazDpm%2B3Wzufhp9ght5qEhLauV87Syu%2F1qe7jSD955C1QgAYPHirhtH5zm9XYaiVaLATXQrTgccAuHW4%2Fh01iNQosBN9mgkA3Ho299WUZJ%2FcsZ0j4TKL3EVgwHD8YPmCXAblR15h%2F8S9%2FX58Vk969cnSrRlpm0NTgQtjlpb56vQIu8AN2CQATWrZexepTVlCLhUcY4in8gGo2tEJdOM2grQN1TXpur6LyWOiqr728ooIXaWUVYAGMMlRRCnm3xcgntI96JKWytpt%2FrguAPJaUl6nqKnor%2BF207zcLjVrO7dTvS66uZSavKUoJyY1jNFdGExq2zcR3cx5sB0WBbfvCeQxv74xT%2BygrPFB1Fl6I3AgkwdPeL0k7olNWwcNuJpNst8sQ5NW3EiW83G5BDo8dx0wOP7iOsXziO7QJClOiYVOKMp7jvwu8hWjtU7HyEwN7ukp1ooxeUYacl154eZVOXmbSPXLYutzRAf3gbamwJHTeZ%2FGRoTpltZh3K3TuLBoD1gLvkbyH1w3aWrutiyY%2F8NitXcD2X%2BJhtxi98ff1Phb6LbfqrFJ0S9%2FDQei9XmK%2F%2BDaAJ%2FWzGnkg%2FMOicDYzwtiVKuOEE6LL9eXR3Orj%2BN5iaHaTH3iQ3pDbSNprapC3QFpxy7Wc2G0Ak3n6l%2FLMA1J%2BVq%2BChTB2VzLEM3KEXs3mFMf%2BvvSLdZ9MDvDzuX0tgs08vNDPNy8hXMrLgB3BDnDEY%2Fi9UOGBH7mN0HLkbdnMpO8UgmxZTaTkwS6duOD21RBVJxPBj7hw64Q8jwzXp2Zruu%2FmnDtQdOVg0ZX9IdPfH%2BpVVu45y5M0RsjAWMrOwofFp8AOCOfEhh38geE%2BlXggDJwCRzxW%2FL3gSTrVm%2FWNOkUFn326InuLujWhvWKLoiG6mXW8MvdXvaoSVYAGD%2BQoTnA7HA6ulqZH09oHjh%2BDz0VjRuFz97L5w92IZIEKJ%2BXnL31nDB3q34wcgYVNzI6g5qqLyJoe9zzAk85X9FvaDD3VGklhccoacWMyJ2vxg%2FRvxPUJuXH%2BSP5I%2B0BO9ScdBk3tofWBUDr91A5Ja3pUCIOqWy48G2Z%2BpBAVgBeI%2BSfI0teIGIlauyRi5decomM4vnn2dBr82hmTYUcUgqFHPEB%2Bl%2BedToXV2KJXV%2FLZp6rzd3HL9xbHf8y5sbrp3vG8%2BAWU53mD4NsBDCUNSmed2SlquNRSHb9wtC8eGT7ePE68mJtGZa%2BHSA10wkORQ4GAY5MO%2FrJ47GjIRAUvgDBNmRNhK4R1yaquYrjdA4CH%2FoULPHK4qa%2B%2BV15Wlr5ByD5Tfunz0oRP2zgxd65tVHbkEZoHtsGYByRQWtR4HXoXXAyvLT0d4OeLGF49%2BT18s3zS%2BP1BC0rSDqPaIy9AGMjNVCNQnHqEtFfMDthLWBN3dPNSEvwIMlJwHOkD4BFTnsTvAm81Cww99xvvHWHf2lOXv7EwdlJdwaaa4qhHpft0inJzXwNdhKikzdPK7iI5b%2F5iBrSPWDl%2F19I5B0IYWTFhAaN8Dq1fuGTcaHy%2FavKEHikLwvA5jNVQkQSGb5k%2FK%2B341uBpH9A%2Bj1j5pYBzZv3MKf6jfNSS2%2Bj83hJ4I9%2Bgrrpx9isJN5Nf%2BTe%2F6u%2F2mgvM5GU9YibpdrLPodpyowDlStnJ7Gy6nBC5FgA2zJrCY5%2BL30vusdrqznc2pTRUxMVH%2FsTKO4%2BKiASREr09cPw4gAdfZMIbaOkQKSjvcDt9KjFqk0x4E9HkjhTP%2BJ%2Bs84hMGzlscAouLmYmLb9z%2FceyjJ9z4%2F2bK48a1NUWAxdFnmxUqPam4NJROku51givoKkTY3auORG2LHD82I76JNgFvEDYg%2BrIYXo1Z38QmSBid68vTo0WNefI2%2FPE3NT%2FLoQvHutHX7JojN%2FN83t6pHdQC23m9pfOha%2FLNK4OD6y2kr09By0NCh7SOzaEhgPkDpuY%2FjOyOSd4qq67vzFmXzoUWp3%2F7%2F38k9mx4X8Eu6gOowRNnbB59ozY8JC4vZsyz0TKOsoAXtFRstV%2FjqAmA2Nc6j970RoizsEFHBTUpJSkHaKtsObDieLWAnIuHGwNXxfI591Dd3ik8zHbuKc6GAKF%2FampDjJQC8rR%2FTwiGdUenxrZXeTq9JM76GinF3IYQNbeSUXME731SH4IARAHgY2zSIcoe%2BgCYQ5MdWgZzu3ZiCPbAuZCAB2BZ4Z8V3s77E0OPb273964NmQ7ZJPgpQXICRXJZREhEaCTBwyYoImVJKi9iqENow5oD%2BQY79G0QQxRg9YVe8x2sAJafUzEg8frMAtBXlifRzZ5z5qI3wQLXDH%2FLPDPfZkDDOhA6daQfj9BTvgmIUiBYR6GQCcHBwIkRWBySiOP0EMONdUjqzvs3ThI3wC01AsCHnXkGe8C3gRy3Pk%2Fnyad%2Fg9dE58AAAAASUVORK5CYII%3D",
	buffer_zone: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACu8AAArvAX12ikgAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAF00lEQVRoQ%2B1XaXMbRRTkhxIS4tixZd27vpIi5ICvVOLYsm5pb91a3bLkixwE%2BFNNv1lE8cVQLgw4VeOqrllZ66npfv36jb%2F4Qv9oBbQCWgGtgFZAK6AV0ApoBbQCWgGtgFZAK6AV0ApoBbQCWgGtgFZAK6AV0ApoBbQCWgGtgFZAK3A7Ctj9LJwwC3dg4HZ2vIO7lBtJ1DsZBGMTzekO2jMTjckOGnwOuAru4LFvdqSSn0aZqDRSqLXS8IdZEjUUWUFruosW186pie7CRP8sQm%2F5GZEvugkUnQTyVgIntU3kKhtct%2Fi7OMpeHPVWEh7tHAxJemKgOzfQXxgYkOj4ysTkxwj9pUEHGHfT9mJTi3atNDIoB2kUSPikvoVcdUutJS%2BhvndJ1OuniQzsdhJVbwtWM4YgTKA9zZCkifCMApBsjyK0Zxn4oyzsXlrB6Sf%2FP9tP3xmqIoMLsSaJDEiiJ4cjunK4NAlm4LGSwXhXwQ1NfpdhlVltN4Z8%2FTFFWee6gUoQR7VF67fTqFGcKlcFtkKZLVFiBpSCJPJuHG9rMbwubf%2F75GfvTcwFHwzM3mUxumBVFml0Zmk0J6wce9QbsldHBgJCAqm33Mfoak9BnluzJ4q8w6S2OqxyM0KtnWKopYlURLKZRpEEC14KJ2wTIZqzt3FYieHN73hd3lbPh9X47ZEXkuMrqaahiJ59MjF7b2BylcHwIotwmUX3lKTnGThivW5ShZPPyrZme%2BgsDtA7O0B3eYD26T7xVJFuTPaYzPvwRrvKBVY3izoh1ZW12s6wqikUfCGdINkYjpgFb9kmxxbJs22k8uWmIBLnxEnyvcTNyYcMkOGliek7E6cfo4quyF78YuLyVxPnPxtY%2FpQlWG2KMro0CCYs07bNIGrNmMhzGUGG6kOPM9cfmGp1%2BwYJrlpAHCF%2FI0lN13CPPkWs83uxsJA9qouF1%2FFDYR3HzAQh6oSyR%2FSejDuB1YvWCkXIu0klzLVzRezXnK3GxA7C8x3acAfT9zska2LxMaru2adolc%2FzD1mML1PonybRncVp7xTTNoPBuVQ9w97O0OoMnpAHbMdVUAmcdgJOJwGbqDC4SvYmbZ1gIkcBVWWSl9jTBZehRxsfMe0PK5t4U46Qs7ZVvzsUzh%2FtEZIRdIxkBee5zxCVS424ZVV9ccu15OVisJqPkpjDixVIZJ7iOImjEW7C7z1G0N9EaxRDuEgqW0vaNsfs5y5DyNtE2XqEYvkhCsWHKFbWULLWFclqEEONJC32rMfK%2B6N9Vs1URPMU4Ihh9qa4pnBYekSSMZKPQ8ZeyaeNiUog891AvR1VW0g2SFaKt7rQ3OzmwLdbvCj0aLVwmVYBpaD6VsaGgeaIt6cwiYAEnWALdXsdpfLXODm5j%2Fzxlzg5voecIHcP%2BcJ9lKprqPAdu7kNj9VsjPdp%2B6eslomitx1V1WKf1pjgkuICVjgvc5xVqrYyUZK3aeeOXFGZ%2FoNdCsbbGissRG9M8ro%2FWCmn7C8qjpnGHEeNHsl6G6jV1lAsPEA%2B99UfKOcfoM7KWvV1WM5jihKD20ogIFmf8Hq0powxhp1Fi1vdlBprAulJm7YVa3p0gD8%2BUM9uSNuy74VgRNS8PZJ%2FSV7uwgKGkt9PweWBXV4kLHsDVvUhauU1kn2kUGNl67Sz7fOywTnskpjXI0k%2BVxsE7V3naLJ7DDW5oAxl7z2F5lTG2QFa86d8jqrYmPwHJP%2BOvBpHDB6X1XLYmzbJi3Utwm7E4MhnBladlpTAcQdSqV2SkDH1RPWxN2Qv094SSqov2dcBbd9ZfKNG2q3Z9bY2kuCQf%2F1s2tHhFVI%2BqwsFDy%2BjqOLH1SoEB5evEF58h8HV9wr981ec1y84t18S395dkteJJX3e5OVDSNusmszMKE05c8%2BekfBzknxB0i8V%2BkTv%2FPndrORNHdGYRnNSbl%2FShwIhJ5XsLp%2Bpat50z8%2Fm%2FT%2Bn%2FWdzaH1QrYBWQCugFdAKaAX%2BsQK%2FAU%2Bk3VS%2F%2FNGHAAAAAElFTkSuQmCC",
	btn_max: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAAAZCAYAAAAPMmGdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAADuNJREFUaEPtmld0VlUWx%2B29V6wgoigISEcGhYTQSwIByRB6gCQUUQOhhEQQCE0CIYFQIqEYCEV6lTbShFFglBrAB5EHly%2F6Nr6d%2Bf0vd39z86UQ5mlYi7PWXvd%2B9%2B6zzz7%2F%2F977nHOTO%2B4ItEaNGrnbcmtiEOQxdC8y%2F33mzG25RTEQfyWINUKvvPeeu9Kihbvy%2FvvXr82b%2F%2FeeZz%2B3auV%2Bbtny%2BtUXT8%2F6BPuVY0v9Pfv%2F57qX5b%2FmfAv4Ky6UkCFijdDLTZq4y7DtXZs2dSI4ePXuRbLEiNS9Ji%2Fx78P76LcnZhe9Y4xzqEED933Dhu5048buFFcTPdv2zjve79B4Zfhids9ha2edOu5b7FXGh9Pob69Xz%2FMhfI56t4mxD737rttcu7Y7XL%2B%2BK67E3PbWrevpVsbfIA6V8bcE7uXgYAkYItZIvYRTlwHmEhOWhEgW0Tz3BGIMiBBRen8Tsvntt938GjXcJy%2B%2B6GZUq%2Bby33jDFfiiez0f%2BcILbtKrr7pDgOWNU4790%2Fg8%2B7XX3DD0x778sluN7Yp8OYK9ydhNrFLFjX3lFSdfTF%2FvxmFj4PPPu8jHH3fx6MiPwpo13XkCrzy7S5mL%2Bkk2vPVWCX%2BLCcwKsalgbqX6VaTrJ00pUouJ0GKi066XmKSI9sQn2iPbstknO%2FTOdMP0g32PMEYOJORPmeLWLlrkPh80yE2LjXUze%2FTwJKN7dzdx4EB37ddfXWp0tJsG8D%2BQNWX5cZbsXAegSfhUfP68W7t0qRsPsAeZQ7jP8uEUY%2Bcz9ujOnT37CyZP9uyvxIbsZLz0kvukY0enNn%2FWLPfnn3%2B6vBkzXDJ9Vrz5pruAH4eVxbVqhWTV66%2B7hGefdQf27HGL6TOcQBCxh%2FDhGwJmI0GqcYMYePc%2BVsKyrLmV0K%2BErscJSVeK1Is4fh4ndLX7YhwsxrkSV4EG4R75FgiBYPACQ6J%2BYfIPbCc%2B84wrmD%2FfA2%2FTunVu7vTpJWQDz9S%2BO3LEjSSTdwD4eYAMt3uGDMqHlPaM4ekfPuxinnjC7UJfuufoc5LxzIfvmNsIxo5v29bTX5Kd7Ro8%2BKDrSZ8Ojz3mGnLfJiLCezd48GAXyTql9vWqVW4I%2FeYRMLmMlw5x6WSzJPnpp121%2B%2B7z9NTeeuABlwzJHyHRZHt%2FMn0CekcYuwQWhlEQv3IwC827Il2fi1KkitAfAURyhnvJWeQ05eoC4Ohe1xDBPtkWBHr%2BIySYjgWG7OqZ5CBRn%2FDkky5v3rwQEOXdSKc3wOyjj%2Byew8527rdVreq24NMGAE4DvEjGVTtGELR95BE3h2ebeF%2FA%2B3yyT7rfVa%2FuJvA8ivcRPnFFRUUuMy3NnTxxwl0i05Xtv5LBar%2F%2F%2Fru7cO6c%2B%2BuvvzyZSDUZjd87Zs92O7Oy3A7JnDluNb8VlNYWz5zpCsjYIuTA9u1e3%2BkdOrhFLCnfk9WGg7DRva43wqwyupZ4pUgVmScDcor7HU895dbdf787RMTpnZ5Jz4iyAUX4t%2BjuQPcYE9Bvyb%2FQlajfMYD9SmsW4CycO9fDITU11cW0b%2B96MvEeiO71TE2kdn30UfcFsplsmEy%2FRMZoAzFRDz%2FsSROyqyZgqR0lU5%2B76y73N6QZfrRirOFduri%2BZOJHZNSkZs3KjJ%2FCFStcLXyuQwDExsRc9yslxdVgzjUIjOZIPBmYfs89LofszWOZkMxhqRhGKf%2Fn8eNen2yI%2FJA5fIqNhHbt3KhOnVw6S8jU1q1DgSUchIclzf4bYFZZXQuQUqSKtOMAJDmBbAHEFYCzDNF1F2VHzyWKOg1oWb3bJ38DegqCgwCiCUhPdveQaYsB7vPnnnMtIGiBT%2BoWSu1CIn0ZEb6GqF8GMNvWr%2FdAmsV9EwKhw913u3jkY0rkJbInJH52Xb582dNXVii7Lp4968kff%2FzhPdfarZLZB3I7ESDVGZ%2FznNu8ebP3PpYsVL99rItW%2Bg%2Fu3%2B92btvmrmA7Av9HQuhi%2Bs249143geoxiXn0xJ8GlGWNqxZFBfg0Kcn7nUgwNSW4khhvI5ViD9XFEka4SLaDWSFYlYeZJVFldI2LUqSKABF2FCA3Uap2sRaIzHxkKRmxE6J2%2BMQeQ08i%2FZ3ofuPrSv8rdPejewBRgKjkriHalxG5GyAqn83HekrfujVr3NzMTJfL78UQu5x3Kmf5EJ6l38uXe2Ad3L3bJTFGd4AdAkBdkBhsSppzP6BPn1AGdiJDGjJuS%2BQDMrUt4yYyn4UE1AH0l3CNxr%2FWrEFqe%2FfudT3IOrWLFy%2BGqkRubq7bvnWr93xscrJLVJZCahoyGlLbYkNVoiuZqTaUNfhuAuVeZJ6%2FtEzkWRzV5EuIt0Sx640wE643o2tclCLViFpFhmZBzhLK3FbIWkzp2QJIuVyzeb4NYkX8IaQQ3RxlMrrb0C3wyVcQLOL51%2BiK1A2A%2FxkAjweEKX55XZCT42Ipt8WAqTasXz8Xz%2B5zANIVchYAbGc2Nf0jI10y9taQHWnYTCVbMony6YwXAWjTMjJCpM6eOtXVJ0MmkJVjIOATdOcD6j4qxWH8nUnmtCLrVXLVNm7cGOp7grU1xi%2B%2FKZTfJUuWeO%2B6M%2F5HZGWmxsbuQnbu2dOmufNUCq29arq39ThkkBv53o%2BA%2BArfNb6kyMcsvwLMblZXXKhPKVJ3MvGFrD0TAWOcL7OZjJ6nQugonkn0rhCSpZvOvfQlc9HdhW6m1h9fL9XXzYaEEQAcBaBd%2FF2lABEYVr6uXLniLvBborKnps1PC%2BzOY7ypgJqGjTFICjIem9q9%2Fvbbb57uEXTV2jG5WIAc5%2BuO5ip%2FZwKmxo9r0yaEu44tR48e9X7Lj2vXrnn38k3v1LpSVuMZJ48s74jd1fn5of5G6oEDB0LPniGIkvv29X4XFhS49oyZ6PsQjm9WBZjdjO52yruwL0WqXhRRstKIfpEnIhcTYZkMnEf5G8mzJGQa5WcTuuvCdAvQVRAsRVf9pS9dZel6snTMQw9562MXf%2FepbKhCtilD1PQRRK0%2F5VTlT20ZZ8%2BO9BtPVAftpjPOYEjqQ0lX%2B%2Bmnn1w9jjBqWzdtclGQ0AsCzIcV%2BDoU%2FQ7s2C2I1EdtN%2BVdTUFhO2MdaayMyt8ExptMln%2FKfCLwuS5zvI9Sq3VfrVevXiFSn6ZSNCXgBvD1pzb3rZnzZ%2FQ3HDLANwVsUnx8K8Kssrpat8VJKVLXC3xkDQCkMHAWjg8lOwYpQwF2NpmZgXPSKdShHb1l7BhHoTuL6BwY0J2hjEdXOpIiHS%2BI9ChsxbAbLKu9zjqycuVKjyADvgMH7xaQ049Ilw%2Bymwa4Osq0wv5RPzv7A2pV9LZAqNooSNG6l4hvOtZkKCg5nF%2F95ZdQBoq0XTt3uv1sitTKy1T5Kx%2F64sNwbKZQgttByBvMxcZvzBcna0%2FeeaeLRL817%2F9O1Uhg%2BRnP%2BMJKOBT6%2BAqzfjfArLK6wngVUorU1QxoxCqqxpEdfXFMImKnEekicy0i54wwPRsOeNLr7%2Bt%2Bjq7s6Z0G03UqEd4FQjoEDvjahVrZFKnvEd3WFgB6NaJcAAlQ%2BSC7s1ine5Ixo4cO9VQP7tvnIhm%2FMTqRfK2xNiwuzvWAeJ1PZ9NnCOVpfP%2F%2BrrU%2FfjYbsvqcE2sCvFp5a2oX1sVm%2BNHb92GsPirogwVBYsFwDz4GSW2EfnNkQny8K6LqDCNz5%2BGDcBAuEiVD3A0wq6yucVEmqSJMxIpUleLRZIfIUtbZAHJMpHpR5zu4HN0R6IrUcejqeVAWkKWJEJLLBsM2FLZmGRgiNcJfb%2FVs7dq1rj5rYQMA64SMJiAyKPEialTv3l63q1evumjG1jn0C0BrpIwmS61N%2FPhj1w4SkgFVQdWNvjGQpJYDqc%2BSVbX9c2555bd7VJSLYF5x2B4KEYNUxsm6X8h6tSQ%2Bayo4rWkXXAW7z1N611B58vl61lKVj7kIQ8NOS8KQCjC7GV3johSpItIM6V51WuvmdCZh2WkOBa8WCPqwYNksO1YSdM2F1H5Edy5HGIvuvZwLkyBARwm1NoBnX3BO%2FvBDSO%2BL9HTXDRv6EtWe6iGi1E6hE62P8xD2JSBrzMmQ3orSuJRPgNaOsxFK4KvTRDJWNkSSmipBdYKlLmdGtSCp2vjYmhuLfhJj9IYYnXPb8HnSzsZ5HMHqMV5VCLemzZ%2BJzbUjfTS%2BiLTqJX%2BVDOVhZkmhSncjXeOjzDXVDIkoEavFV%2BR6mRsopeGlNZi9emdBoKveaTLKsn6A256SV4u1pBHrk8DQN1ubvDIvig1PHTJqXWGh91zP2hMU3bBzkEBQswxUWSvwgfJ84l4fBrpB3vK8PE9XwMeRrToCjSKjh%2FjffkV8CzKlrf%2BZUeujCFSzLNR9LP4oOxPJ6A3%2B2VmkJvA1KUZVA5uqADmBz4UhhrnRTj6aKqIPL7YUBcuwcC0Ls2ClsypZkW6Za6oRZ4TJgO2qRK5lskWaRZDpmxNWCnQVqeaQNgoqkYrYKUxQa91AsvdLMmYeGZyFtIMkASigOpMVfQG5N3880Kc%2BETgcQjoRYB8CouyoCoQvC%2FLrM%2BzrE2MCf%2BDujq4AlW42JXAIQTWSY00cv8cpe7n2YS3uiq9R6L4P0XUZvzdn6mg%2BdWrsLPwegY3cSZNcdzZFH6AzgOda3zW%2B5qNx3iVrXyNQTbSZ0mfNEfge9DWIsSWEXYOYhc%2BtPF3josxMFXFBo%2BVlrBFnGyetw5bJ5rCVX9spa2BlrET3EmWVSps2UNp8jGFHqN3qCkSZNZbf4xF9YtS6LHJS%2BT0fclTug2MEg00ZK8AVOLOwYz5oB64zr2xk8lxlW1%2BZpCdfdBZVCdfvFIjV%2BOaPBaL3HRkd9QvOLUdnaWzKR4nuJRpH8wnqBkurERL%2Bvry5lYWv2Sv3SGMEBddNK8XeWStAfLBcW2mwUhK%2BWQqWnmCWLwQMASIxHbsKUFsvvXWF35ps0HZ5dhWQ6huuq6DScwEtmwoO2ZBd3VtwiLTgGqhAUWCtCrNp%2BuFr4M3iYEtVZecWXp71u8x%2FabHMDBJnZdQ2T0ZssDTYBsuulu1BwMtaR4Il%2Brbu9aXqf8FB%2FUoQav%2BBdvu%2FCW%2Ft%2F6Qs9d%2BEQWJv%2F9%2Fvrf9%2Fv%2F8B7sREYL57PqgAAAAASUVORK5CYII%3D",
	all_attack: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAAoCAYAAAAmPX7RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAEbdJREFUeF7tXGlwVtUZln0JZINsZN9IgBAQcCEQAioGwmJQWQSiiGGmFasiqKN2cEoBoW4gbkyRVjpWEChBBZVFhkIq6KS1LasB1H%2BOv%2FzpTFvePs9773s5382X72MsnWGGfDPv3HvP8p5zn%2Be8yznhct11kb%2FOeOwO6QNJhqR2yFWBAbkgJ%2BSGHEX9saI3JBNSDhkJualDrgoMyAU5ITfkqA2JRl4%2BKseMGjVCPBkVR2K1uVwd7Y0Rb%2Fyfqt%2F6tac%2FWnm8PrFwijfPaPXhOXhtyA2EHEWQ6JJXQ9L0d5HyL7l4ETe8t5%2BW%2Bw%2BsuvhvbRf%2Bab%2FQL1qZ%2FCekv00nd2xvHB0zPB9HT3tjtyn3p%2BiWa5G9l%2BGgY7Z9Hw8jH65wPefj9Hdfi7oi3qENUijQ9%2FFx9a%2FkBuTVhEmkX6VpwvI88i7cfZcns2bJN7iqzJqpouUz6uXru7xrNGEdxfqpHvafM6dDr48DsTBMFBfDyMfYMDQeWM%2BfTyItkZyROw2O5UaeEjNtmpyfMkWvF%2B64w7tCvrlzhoo9K5FTp0aVoA37mw5cO%2FR6mLqL3IxBsaVROJgTx6%2Bn%2BZjDeGjxPomMieROs82RSiAqDfjzkybL%2BdpJCrjeQ0hW8Gx1uJ67faLX1vrw3i83fdrXbXON641Y4L6BGHGKlYu5jyf7OFbIxIbcaZp8Ewmk1zYSSMqFiSG55VY5dxtkwgRPcM82WtaOhHV06PUwjbbYdYEbWYY9MXe4YKj1LZA7BHLnEIjkICDCJ6m1ZnxAWHv3AaHsM65aWsdW61Xv0d8Va3ut621jHK4hmIHgeoEEOs9MftolkObpgT1OwT9fM1avX1WNDkhpHTPGe%2FavvI8m50aPFkq4rkOvhwlJCS9iW%2BiGuxmB4k1DAhfMTGNaYEDMTTfKVzdCSBCuASEsg7vVOrvnc0jOjhwpJtqO%2BkxCev%2Fu6rqCenUB%2FR%2FmeyX00kuZYXw1tipioat%2BF3%2FDDVzEJJAWeHbE9XIGm0YFH%2Fd2NYK0bNhwbcMyPreyLcpahw%2F3%2BlDH8Eo5O3SoJxVD5PT1fruQ3i%2FQZ2FGhizPzZHmwUN%2Bkt63S0tle3l53Pk2DR4s%2B4cMli8x5u%2BKiqWloiJivquys%2BUxzCXWfMM4HMN7HoAe6v1i2LDLxkEJAn6Ko7%2FIiLVhynvWKbaOOElM2xioLpQk%2BIQo%2BCTLyMB9QIpDjvbB8%2BlBg%2BTMkDLtY%2B1ODRkkp8vLVM4MAWBWh%2BvxisHS0K%2BfZGVlSUqXLtLYv780kwif9Gh6W0DCp2Vl8uWgctW5GcSP6N1bapOSZHtxseo%2FgjGp52QlAPXnuaukRKaizXTII5mZMhJ9FqamyuflJfLXiqFC8rK6dZNunTrJkrT%2B8ueSYlk9IBsk%2B4swCg7H8b7r8%2FJkenKy6n2toEBYdjk42Lvxqviaft8ArD4o9%2BvjEkiQKS54nBCFYLBOnwHeWQDpTbZCjKiTA0vlZBnARbldT5SVCMv%2FWVoS6D02cKDMT0mRoqIiTY1PnDgh1bDSBwBqM4iIpvdzWNrbAKw%2BMUmvm3IGyIiePWX16tXy1MMPS21iomwDiE%2Bkp8tsgLoH7U%2FAqncWFsqUxL7yaGOj1NbWSsmAAdqnFOX3pyTLw1g4WV27ytEjR%2BSHH34AidfJvOQkyUbZ41hcXDSGgeFwDO%2B4DqQvGFapOimNmP8rudnyGd4zHg66qIERcTPMufhNf%2BC5HHxZFptAHN%2F8I0QASTICWvDCJEEnF0VYx%2F4UtlVd9oy6FogR%2BxKAKcCKb2pqCg6SBoLUuQDuUFFhhH7q%2FQwW8VZOtjTAksaNGyeTM9JBdgqPlrT%2F0aNHJROAPwSLngmXNAzubAbum0D0r9GWdWzD37lz5%2FRKskpA%2BEDMpRRy%2FPhxLc%2BEhY4dMUKOHDokI1H%2FWP80acG4Lg678nLl9j59ZPbs2cH8p2GfVte3j3yQnxcXB2Lxt9KB%2Bp5nSr0FfxyLOcAXC0QNBEQb1mwTNwul4pbSYlVOAqiQ94fhTn6LlckrnylsZwNaO%2Fbfl56mbfcinhwrKRJajgn7bcXL1yT0lkZYBH8%2F%2FvijHDx4UL799lspzM2VGbCWl7My5XOQZno%2FKMiXiT17yARkb%2Fyx79iEhAgCM0DS0B49ZN26ddqGbWt79ZZn0zOEdUYgFwB%2FbHcKlk85efKkzoO%2FU6dOadlplDUfPixFffvKL9PSMJ%2FSAIet0Dmtb2IwHxtvOtruKSjUxRoLBxcP4mz4so%2Fha%2FgTAzOO2BaIWgLOlWDCiXySlaGEvIr4QOEzB%2BEkSGJgdX5btrH2bHu4uET%2BAr1HiwvlTaz0OqxcI4Kgjb75ZkmFy%2BM9rYJpckn37nIv3NvzIJIW%2BTbiEqJ2BIFViGOuBaYjjlaECGSfJUmJEQQuW7ZMvvvuO0kAqbdVVanFdXUIps6amhpJh2ul5T6J6zEsJheH1WgzpXcvqaysDCywGK7fPAjbtocDsXDx5UInXi5mbEMuzFI9wyrRsWLuAw%2BDPEozsrQjxUXSBMAPwSWY8k0Als8clG3Mwo4Ve6uIdZz4GkzI2lLH7vx8%2BQVc2oievaS6ulrJMvKqAEZ1585SBSLNCt555x1NbuhmFyPmvZs9oA2BN4CsMIGlaO9aYBX0Pt4vVfrjahbI633z5kla5y5BWcCCc8O5TKmrU1f5OizQxWE9xrkT7pKk2S8DmMxNSpaPMz3MouFAbInrUYSYo7BoEr0PbtravtC9m%2BzPyVHcjQdiS2MhqXEJPFBUIJ%2BCGHZ%2BH%2BZMIl7rkyB78vLllZ7d5WBhkV5ZvgUvdRDWxbY7cc%2ByzUgkOAHrwwk9gfIpvXpJEl76mWee0UkwDuUiCUgEsAkgMAnXXrSWJUsisNyxY4eMwsvOBlkTYXGuCyV5LoH27BJI8O%2Fp2kWS0NYIJDHzQKBbRiKs3nRyIrTM2RiXFhfGYVKXzsH4bMt%2Bs9C2PRx%2B1blTgNkBuFnixzJiRnypf3dOrhAz6iD%2B9F5mVLzGJZAE7QdgOwAulT8Na6JsQnbI8hdhQVa2BBPegtX2LlaetbUJUQ%2FbPoI2oyDDEYBbW1vVwpqbm%2BUc7k%2F68cdijiUXnKRZImNjKlzjHXihKiwAIzCaxYTL2HYUrGwKxu%2FrEGixd8GCBRGJjRsDTRdJGQ%2BJhsM4lHeCsB%2FJT8Ui5DzZNowDy4gXhXgRN3sO8C0qicCXOmiJxJ2Gsh%2F1cQlk4%2F0w8Y9AAFcEB1nRo7uujNeRIfJKxZQX4UI%2BRnKxFy6A99aW5JNwtn0WL7SQJCLdv3%2FuXOkFS8rAfR5eogBif8ZiBpiPZ8YjSjeQNmnSJCmEngnov7hbV6mGNdXX18uWLVs0E23PAhctWiRbt26V65HW1yLRIaiJDoG0KoLOOGhWx3m4WahLYB0WTjQcqJdWfATbj73IpnPRbj4SrWg42AInTvsQ0z8MYbYLIYb4EjtbLNoW7dienOwrhLvGTiFmDPwY7vOTwgJlnfdGGkmkYpLKQVhOhZQ92rZQXQHrlib00LacAJ%2FXY5O7AStpQkIfaUCyMgaglgPEQYinFkMIZD%2BQloxyTrASJI9HuwcRNzcgs6vDfbjt5FAM7I%2F%2BdU6ZubWZ6J%2BC%2Bbgu0o2HbLdx40YllD%2FuEV0C5yWnRMXhUexjM2F1JG%2FT%2BvVSgTmvzMxoF4cNeHcudmL2SUGR7MbiN9KIL4k3zFhO%2FMkDCVQhgfjFJFAHIOM0W1jhgQKPRNfc6bsZKwPl6GPt3bbsQ0v8ALp2o81LA7JkHIjYgDi4ee1vZAOAInD8EbznVq6UlpYWfV6%2BfLmS%2BAKssQnxYXyI7BQAdw8AcWNgGghsSLq0NzQC6xGXWGek0WXbmFbW0NAgZ86c0XJuyvn7%2FvvvpQeIb0xJlX35RW1wWIaFWQmLI3krHnpIJuLdXsUhAXFrDwdiYYTQe9HCwm3pXomnYUyDMuJjE4i%2FNTGYqmKQyIlQ%2BPxr352a2ySxHIDBmCtFrdEn39wpr7RODr6nMF92wk08i031NOz1JqOsBpts14WWwUrLAABd6Bjss5ZioXyYXyg70b4e1u1aIK1tLgAME3ivQ6oROA%2FtXAI3bdqkBG3fvl0W4p8qkLCp%2BHOOSyDLmuEVNr%2FxhgzFAliB%2BexFZuni8HtkxtOxF5x6yy0yGduO6ZjjH3Ly4uJATEgK8VOPB2s0zKifWBFPSyjJBXkhjs5f5KOchYJAJQMdbHUwI6UidqY18cr4yDafYl9nq4llGj8RaNmXVko%2FT33s34TN%2Bwoccd0HgBdAFmJVc8MeJmUB3NJM7NuGw%2FoKkY09Dj1%2F8o%2FPwm0rsPrDBNKNuVkk7%2BdhPJdAliUC7A3PPSdvrV0rG9euUet3XSjLXkb9m2vWyBy4dJ7wbMc7GA67MKcH8A4F2CPyGJDCe5Z9iIXaHg6WMxCvwNsBM5JIzMxV0hgseTE%2B2CauBQYxEEGTwCsxuDd3yWcq4uBcRRSblA7uE8x2XGmU3XkFSl4dDp55ZEUp8cW1QCvj9flVq2Tntm0yEInLk3ixesQxI1DdLeo3AnyLVyxbs2plRJlZ4HzszWixbgycCascia3NDb6E6wcjltKF34DN%2BoPYR%2F4RhLk4vIbYzoOE%2BfPnB%2FGS96NR9ibqouFguDH2ETMj0XIIYspcgmJEavLik0mrjHuURuWWxNiWggNTkRHK5wg%2F7mdJe7FPsfhppHJyr4CQasSHxTj%2B4vGUK3qU5RxdheuXIrYQFNeFMluku73dd8N0uXmQCQCZbpnPbhJCAsMW2IBTntXQsRYnPUthOWECabUrkRWvha7tJI9uz8GhKb9AY2PYAhfBS%2B1y8ggXB%2FNe9EzEUsOT7x6JOQll5s52FgPNE1p4im2BSFE5SQ5A4NUPI8a5CoOMyFaJf3WDrg3GwbkgGLjXI7aNBRHcuHPTTrF7t8zq7DoGfV5F8sNk5k7Mi7FplH%2FovQyWSRc7A%2B5wDgB%2FKi1dnsbBcx2slYfZJPIuuGPO4WewojIQ0hNWdQ8zPB9Ezvs9xFgSNgan%2FezDxbIDbjAeDjyfbcSBus2V93SfQYLnE%2BniQFw1tPh5BvE0T8Z7Ys16w5xYkhO2514w7jbCzFwDrW9pZpEa43wxS7OrEWgTsiuDr036Jaz2nyOWLE6F8ApQGVtcYTmf7cqsjoCQhOcB7q0I8kxUtmbnKMi0Dh6O874Jrprt%2BDwVJN4NIt5nPMKc3yeJsA4jLzzf95Cg8E9IM9DPyKOueDiQRB4Rcs4a%2B%2FzsMRYO5uUslyC%2BZhiWcZq1Up%2B1433cbUTgGv394EdFnq92iXIHs3LLSvlsfWwyFg%2FV9%2F8PencV5OJPSrlBMhFL7zYQa%2BTZfHeDpI%2F8PW60%2BW4D8TvR70rNNxYOEZ7MYpzj1TgH9qeLDfC%2FnJMYI8TAt0TE9iEWeFkfuAJ%2FAm6iY5O3lWSgdOj1kjtzs2GvFs0S2V5JvJyNvG3I1ZKY6iIx8fZx%2FrPjo0mg%2BWu6W9cV2ETMfbrbjw69XkIYPghR4%2FGTRU2a%2FA287aWJW1wXyr2d7f3o7mjC5odJppv6khS6RYsVtkpsVVnW6lqxbV6vdb3EmFmobst8t85nLUeyQpx0%2F2eG5G%2FPohF46Z%2FWo5adbftgVhSxB%2FRXhVmfkWcWygkxY7JJ0TLVn%2FsbV%2Fds71rWa3%2Byo8W1IdA%2FFDGLDLwZEkKHwOCf1l%2F6uAUnMSTPtgFuoDVrMldoludmapbBeum3l%2Fyoa2U2C%2F9twbhDr2dph4AJr%2BYuL50%2FOwfYvge0xe4QGHzc0ubzMv3bE08AnKxITyH8MlqYCQkkYeY%2BSZTtZVjHexM71enQCyyRUWoc9K%2BWPKoHdFyouytwyIv4vKzNB548rvE%2B7Gz74WZwxOHcBB8%2Fuh9%2F%2BvVRP4wM1YXbROiLNmCUsvBHmjaViHL3I0z7IJQNY3xkerkfqnofbYY%2BAo3yTah%2BQcTx%2FDGtT2ycPD7a%2B8CTH7hE%2BcSanw3H%2B8w53ifY0eqvhE5XR6zPny93LFdHvE%2Bi471zNF3t6bT5xZtn7E%2BsSaBLYsd%2FcnD1%2FecOcf%2BTA5fEjv9m5Or771W4U4j634z8F8sXtfC%2FNovIAAAAAElFTkSuQmCC",
	all_departure: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAAoCAYAAAAmPX7RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAADNFJREFUeF7tXElwVccVdaVsbAYbEDNmFoOYEZLMKDCYQQwCJCEG2QghCSyB5SAMsQlEEqMMGMzoMIWUSahCFHGREJcTu6AcChYsYIUpqiALdqwMS3adc1r%2F%2FNz%2FeOIrWDhy8V%2FVre7X777u%2B87pe%2Ft2w9dLL8Vev8JtC0gbSDtIUkKaBQbkgpyQG3IUevFBK0hXSAokDTImIc0CA3JBTsgNOXqCRJHXGw8npKenu4Q0PwzIDYQcxZBoyZtM4m6dOJGQZogBuQF5k4MkMq7SNb3nkbx%2FvvfeE%2FJtYaH7dvly3%2F6Pd9%2BtL5cubVD43L9j5LuiIvddcbFjyb4o0Tr07HPWg3a8yDbw28lNhER6Ijkjd35xTBF5JOebJUvcN4sX15dG%2BCz6HO0k0OuFSeBd9SNiNRHUp58M6F%2BE83nChkI%2FiYUd8TEkck0kdz7bTBOBUv564UJHIYi2HrzXs4bKKAm2nwbItYaS0IQNcJgADoZAJjbkzqfJY0RgDBG5ue7vOTnu60jJOuXiggVedG9LPbM6fJ%2F9Wj21BYm33uyfJWyIwd8QyB0CuYslMEjAxXnz6gljaeRv2dnRe9VZUi7MmePLv86d68sweWIcMyFIGomM6iRsiGIdl0CBTfAlJMTWef80%2BQrPKWE6Ye3q25LOyZKwod5JLP5xCRTof5k921F4z1LAn581y1HYprot1X4OOhTp8v2wZ3wuPRHP8uQ773j9%2F6cNsrk52CD84xIo4FnWZWV5cC0ZbDsbaSf40mEbhffSOTNjhpPwmfT13OprDD47OGmS69atm%2BvRpo3bNX78M9mwoF8%2FVzR4cHR82hFmw6lp09zGtDQvv8U2ivJRaqrr8%2Frrvk67KkeNcvsmTvzZcQjDPy6BlhB9tMhhaUmx5LD%2Bp4hYPbUFn%2FE%2B2BffOwDy%2BgF8Xrdu3XLTx471JD7NhsN4p%2Fqtt9zJqVO9Ddl9%2B7qdO3e6LevXu%2BUpKb5tO%2FrZPm6c%2BwM8W%2FYdh35VZqbbhj1nFfZZlGrsTQuQPN28edPNRwQgefl5eW7YkCFuy5gxUTueNw72e209LoECVh9pCbAksf309OlR0nT%2FR8xotatkG%2BUUwNPzL%2FGu6lZ%2FdKdO7sKFC55AXgMHDnS7J0yIjhO04QAIqAXxk0Di6owMd2zKFJ5W%2BHevXr3qBrRt68krmznTjRw50m1E%2FTh0OCZtyMFkOf3ZZ67u8GFXd%2BSI21Nb6x48eODf%2F%2FHHHz1xjx8%2F9pIJO36NPn4OHILYipe4BFqQ9ZEi4AQ%2BXHWVBEFksI1rF%2BXo5MnuBGa42lg%2FivcprOue5RfQpV4RvKW0tNSDR8AuXbrk7t%2B%2F7%2Fr37u2q4GHUCdrwm9Gj3RT0yYvvMmxaApNB4PSePd3%2B%2Ffu9DnXpVbIhC32fPXTI1cJjSXAGJoG9aMejR4%2FcNHzTvXv33HJkx%2BXDhj1XHMgB7SOO4oPfTpzjEmgBVgfs7FMAWI7QtIuhSiQBDA7Ajlmynbo7AEJpnz5uG9aQ37%2F9dlTYt71nnTol0C0ZNChKBEGbgLDZqUMHTyQB5D51FO4LQYa1gWRYAgsxCSyBvbCOTnnzzRgC14Io2bEO70%2BGF3Mce5WVlbmqqirfVFFREX3%2FzJkzbixw2Ix18nngQOxom3hgXZONZVwCjxjA1RHJIyEeaEgt7kWGBrLkSY%2FldugegocdhrBvCe9rkDgUwgNS27VzmREQRd4GAEQhkQKX4DG56dOqldswYoS3gWQ8jcDOr77qxnXpEkMgwyDtkA2zunZ1QxAqddXV1bkMtnXs6KOArgXYqya3bu0KMImaGociYEURZpYHRSvyEZfAfQCSiQRBZ7kDC%2FdegLiKWR0GWI016XNkZCRGZGg270GSsA%2FrRAl0l4EY6dbAe9iXlRrMtIrhw11bALxp0yaPEUNUb4DTpWVL1wUkUTq89pqrrKyM8Y7z58%2B72Qid60AiybAE0vusB%2BrehtAP8B5toQ1VkL5vvBEl%2BMqVK65Hjx5uMOzvDhIHITLoYiTIwUlUy1decYvxvKlw2AaMlwLbAvT5%2FoABbi8wFGbkQfgS77gE7gU5IpEewk7XYHbWYvEvAXkkqBSD5Pfq5T6Bh0h3MwAlaeuGDnW7QWQZPrwWZVH%2F%2Fm6h0aX%2BRujOgCdlAMi7d%2B96D7t27Zr7Nwi8%2FcMP7s7t2%2B42hCVJ1SVPpFf0RJqfB7KXon8RGMNyAzfULcfEoQ0LQFSf9u0dPY4XxyRJmkwajzZYO6iThomTi%2B%2F6qTgQm3Ks2ySR%2BO6Bswgz2ki8hDHLRhHIrK8aXkPjOABlLT6a5BZHyMtB23wAuAl6FOnxHXoGB6Ou9KS7GbpsywZ4GZ07u%2BJly1xreFxPJBt9sVYlo53rHa%2Fr16%2B7fmjrCk%2BgtMDMz0LGmdK9u5uPdvbJ8MjQdvr0aZ%2BJNuSBK1eudGfPnnWpmHSlmJAcvwdC97%2B%2B%2F95PHI7ZFv3LU5OTk30Wy4v11i%2B%2F7ObidIrkla5Y4TIxLr%2F1p%2BLAb5gHqUBiFIYZ8SLukrgEkjzJ%2B5gZHKAAH7ANHshBtiJ0Loa7k7CVSBioy30a6zRkKcIn03aSSN2F0GUf0qU%2B62zLwTOm8eUAdBoAHYRQlgzPImC8CCDDaRLCKAGeCp158PJPMDNpQxa8OKhLG4JJDG1QG%2FtlnTakIykqwT%2FR5OO4ak1%2BvivGGezFixf92Mswse7cuROt52KSPHz40J06edINx9pYjdDbVDjkISliKCe%2BNcAsD984B9%2BxIoKv5aTRBO4B65QP4XkkjyRytpFUDlLBUBkhmwRKdytCwSKQItL4oWUgiDrWED8ZIrqD4X37a2rclwcOuGN797pjx4554Lgf477sxo0b%2Fp5ZYQp0ZUMhPNwSyNMT2msJ5ASgDUECaUs2gNqAf287ijG%2FwF5wF7YS2gMexr5QddpzfN8%2B9ymeU49ZKMduahw4%2BTixhNmOyCGGcCPGcQkU0FSW2xJsdu69BiQyO%2BQz6tjO2SZd6lM%2BwlpRC%2FIolkCOswaTgDpZCInjQfosjJOHvm0IHY32URCG0HTozkbolA08%2FgoSSBssgUktWngbwgikDXPwPQNAPCUpKSk6cVojnNoQSu9Pg%2Bdtq652lQihGfDepsaB%2BFLWY2tDrEggRVGOZVwCLesikC8uxwKrGcJ7JTtBEhUiqVuK2USQKCRQdRnEtsXw7BkgsADJCM8eP0Z4DJLCY7LfwYuGA%2BDu8KgVkdOZIIG9QcIUAB30QO4DGyKQNiyBDexX6x8PBNhXkMBO0GFYXb1qlcvEhGpKHIQvMdNkJ14iULzEJdB6Ccnhwkqy2M6ZbEkI80K9z1lkw2aQPOrVIIQWgbQUeMFQrFMS64HD0C75fNcu99W5cy4dhHOdtWQz3O1GuP3zwYP%2BHFQhONimNVC2lSAKdMPxnTJRlqlIUHiCc%2FnyZd8PQyj7VGhnSB8Bu5hgiMSwicxnjcGB79KeIL6a6MKfOo0mMGiQ7oNrmQaxode22dDJWaRwSv2F8Lq15eV%2BuxAUbSPCnn28dq3jvzZYApmxpqKNIZjCkMuMNhcTicJ7XfRG2lGM9TwbB9ZMTij0vBEIjTux%2FVkE24pwyB12cXvRHgRzDQ8uC8%2BCg8Xa5hV2eZJOXALlqloDgx5pPck%2Ba0jPrn8KCYrtfJaH8MXQROkcEVtXmy3n80gP7zKsViJCzMRB9URkvTwXZZsXhF16CIWh%2BUNED551kkhmsbRhJZKrrQUFbhGyz7Y4NMiFLTbk54PEjlj3tI1R2Q7Z8hb0HzaZnxUHYWOXGtX%2F5yTGkij3Vqh4GmnKXO0sktepT0uewAqukTS8sTaQrBIQQfI0vp3RFpgPkKGSUGtDGRKnZTh0YEgOgkc9pvecDJoQHE%2FrUhgW8Wx4VhyEf1wPtAkG6xYMrXlqs8aGeawNpQLNlhawsNms8Pui26CJQvwbRWBwZtm4HhavRaQW2%2BC6ICJJHveUQRLtuqhJExznRbbBfnujCBR4AjYYi0VQMMyFhVD7rl0Dbd9hsT5hQ330o1h8GkWg9SStTw3tTURiQx5i1zOtedYDg%2F3bvaddS8OSIT5XXza5Ck6kX7oN9tvjEqjT72A4tLPArl12a2DXLO0hCXLYJt4mEgKYbXYtTdjw35MuYRhGYMx%2FrdfGPWxjKi8L2w7YTNKmvVr%2FbGnXxGCfvA%2FL5IL70BfRhsBGPvpf62N%2B3BI8XVFSYU8DRJb1IpEmb7Ib%2BLDNbpBwkWYJDO6pXlQbbFQK%2B3HLEz8voxcGPdCuTXazaw9cbeKh0Gp17bZCodWGZo4hj0zYUH%2F4LxwCW4iYn5clfuDZDH%2FMGfYj24Z%2B4MkfuCR%2BYv0L%2BFk5eAr9iTUJtCQm%2FshB8%2FvjDnH%2FyIElMfFnRprfn1fhTiH0z4z8Bz5z8b4VVUcLAAAAAElFTkSuQmCC",
	all_breakup: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAAAZCAYAAAAPMmGdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAD2RJREFUaEPtWllsnUWWpjVJbMe74%2FX63uu7%2BtrXu%2BMl3uLYWWzHdrxmIasTZ8WxyQY0hA7MpJ09TDpbJxENDAgpNHQLGgmBZohoGh6QBoQgcRhBI8EggXiBR96%2BOd9J6s9%2F73USmDeklHRUdatOnar%2F%2B%2BqcWuz77rOlmpoa3JNfJwZ2Hq0yybxy7X%2Fvya8UA%2FIXQawhtPHRP6F5%2F7Noefw5zZsee8Yqs671wPOY%2F7v%2F0NwI9Uwfe7%2Fb2WJ%2F6lHstqJ%2F37N7A%2BOfgwOxo0NaxBpC6x%2B%2BiLqHLoD5vEcuofHRpyNy1jU99ieV5v3PqLBMPYop2%2FuyTKkeO2bZNTai%2B5n%2Bv8QubZv5%2FhK7DY9cvON86x%2F64%2F%2FL7t1wqNt7DnX7zismv2S%2Bd7NrbFnEGlJr956XAf%2BIubvPqswTcutJsgjrKaxrEgIbZFIUu47Rjc4rthxEXl4eEubkoXTDfrVn%2BtrtsWy3G5%2BRizlFtdYc2K967ATmjj9l1RWv2gMCZcYs7NuGouUTqNw2iYxghZadzcuQkJmHqm2HdL7UT0jLhKO%2BE7W7z0TY12%2BV9viUdKR6ilG5dfKO8y1b%2FxjmyQKw4%2BDtWMswCOZJ%2BX4t0y7HKurZiJlx8ShYuOpn43A7XO31HJ8SQ2rVxB9QOX4KJp%2B76wxq95xTYdlIPckl2SRaFoKpN7p2%2FdKNT8Dn84Hp6tWrqJ2%2FECVrH7X6Upc2aMv0Z5mETk1N4fLLf0FGqAaFAw%2BgcvsRuEuqkZaWJu05mJmYitbWVqQVhFCz6zT8PaMYfegJdHR0IBAuw2uvvYbOzk48MXkEV8WW1%2BcXkh9UQr%2F%2B%2BmscPnYCnuYezJ04FfF9M2Yn47vvvsNb%2F%2FlfKGloR3jtb1G6fr%2FOiePeyHMRl5qp4S7DX4bqB46rjYJF92Pz5s36vczfe%2B89LZNYbduyBT%2F99BPGdu6Eu33FXXG4G74Ge%2BpRYkgt23EcpduPgbkpV4ydROXOp2DPq8b%2FXUGsFjAo%2FE2xl%2Fmb%2FVK8JXj11Vf1w5gKCwtRLKRSt27PWasPf5dufBJx6dmIT89REJgIyqzUOUpOjsNpgUTCv%2FnmG9V55513kOTwI6tiPk6dOqV1po3l2tpafPXVVwpmW%2FtCtLW1qc7zzz%2Bv5AQHd%2Br8Od%2Fg0AQaGhq0%2Fcsvv8T%2B%2FfvR1NWP2pY2TH32PyKf6WKbuv4ZvvjiC9V788034S6vR2jVPp3%2FdKSS%2FMziWmt%2BK1euhKdjPco2%2Fz4GB4Pjz8GXc6YY3VhShdCSrUdUSrcdtSS8%2BhGUk3CpY14pRFeJIQrLrDP1JbKqTTm%2Fddj6QAL69ttvK7hurx8BAY%2B67E8pWrcfvnCFgjV1%2FboCx8R%2BBrwff%2FxRPYwpNzcX7777rpZHRkbgbFuBzLLmCNDY9txzz8EdKsXw8LDq8jfJpK26hiZcvTaF9q5eBAbGdN5pwWptZ%2Fr%2B%2B%2B8t0tIkFLuDxaivr9e6N954A06nU8sffPABZme7UNMsxE9dt%2FqxP%2Bdv0osvvqi6TIxeWVVtyMrOQUpBEcq3HbGwNJjcDV%2FOt4xOKGL6xJBauuUQSjZPRohv4Qq4Khol%2FO2w6qnHSVRsP2pJ2dbD8C9aqbohCZXens2WR%2FDDGhqbkJGZpR9JQLlyZ0sYDHSNqC32L1rzW3gCIXz77Xd4%2FPHHlbj58%2BcrCK%2B%2F%2FjrcHq%2Flqfn5%2BVpPT052%2BFAqK35OaaNFKonhWG%2B%2B9Za1UDiuSVw014SAa%2Bp11%2BEtLoe%2F%2FwH1aiYuwIO%2Fn9RFxPPAnMIqpDv9EV5YXl6uuoxEKZ4wCocfhLuwBHv37tV65oZEfovZhth26NAhFc7x8ksvIdMXRunoQcUhGlviHI0vf1PIBcVwMQ2pkyje9G8qYRnA175cSTISkEMI642UbT0khkmwEHqTfGd5A1Jz3WhpadEJG0J9y7aBQnLN6uXKJWBJQgpDF23ZiWGoZphiOnbsGGbJXmf2qImJCa0nCb7%2BHfJhk0h1BS1SOcbvDhxAkjOAuLQsDalmXIbHmWKLNtesWYMZcQnwdq7D7EwHPvnkE7XL8E19460cLyjzYR2JvvLO360QTzuZ5S3wyALltjFd%2BGXdS0Ie09mzZzE0NGQtMJ4BPGU1CMqZwGBqz%2B34Gi7oZPxmcsHc6MeQWiJkUopHnoRfPjLYu9ki1F09H4UCXnDZVtUJb%2FxXFZYDnetVNzdUibiERN2HmBg2Xe4C2RMzLZmRkITdu3dbH8TCK6%2B8gtJ5rfD1bNF9cfHixdpObzsqgBFIj9eLxJQ0i1SCTzDnlDZZc0iT%2Fdvsqew%2FPj6Of5kVr8QxGVK3b99uAc%2F6gYEB5FQtwKZNm6x5GW%2B7dOmS1p04cQI%2F%2FPADPv30U3iCIY0oZitYsmQJ3IvXoqurK%2BK7bveD32W8%2FMqVK4hLTIFTnKdocAyh%2Fu26z1Ki8TWEKhdCKnWNjuEullQ5qJSIeNuGlMyCeR2yejaBRoLipcxZH1y2BeGRJ1C84YCl6yhvQll1DT7%2F%2FHMF7%2F3331dSGeJ0n9RwN2Xtj3aQGeoSUzPQuWIDnrrwDC5evKh4vPDCCxKKv8U%2FJMTS1hf%2F%2FCc%2Bk4MKk%2B7P4jHFFdVw1nfovJIlQhhSTW48jVFhdHQ0AucPP%2FwQXlkseXVCinwbw2tPT4%2Fq0JuYGPaZ6GmDQ8OoqqnDgSef1O9ZuqwP8fHxcC1aozhkeotRUlKiYXXXrl16Cu%2Fv79dFO2%2FePGvexMd48wGJJql5BbJl7bDwLaTjCA92fD3KxajqFAqZhouAbHPUMxJDavB%2B2dPk%2FmQPuQXNvWC9q%2BoGoUZ8y7ZH6DLs5oRrsHbjKOITEpCSkYl8lxtOt0f3TybuL6zj%2FkKZMStOT7W5zgI4pC%2B9dWjTmIJB6R1cjg5Z%2FQODg%2BjqE%2BnusUglmCSV3pKZnQtHSS2S5C5qyGTo5rWEKRAIoLe3N4LQZ599FgkpGfD03gIoy19inQPoQUwmHJOE1%2F72uto8d%2B6ctvHwRfLSvWHw%2B%2B392e%2FIseN4%2BeWXVZfzpC7nxWSiBk%2Fi%2Be33x%2BAblIPb7bgwhNq5IEeUGFIDqx6CV06l7rrFN8irurFPFDT1wLtk7a1Q3NIH34q9Mbrezg3IlAMF72OpeW4kZ%2BcjxRmE3%2B%2FXD9Hriexl8UkpSnSqqxA51e1KCMfLl3GNLj3z8JGjOHPmjALA%2FSjfH4q495mrx9NPP43EjGwkZTksUmnH7L%2Fnz5%2B3gP34448tcgmwY%2B4CfSTg%2BHZSjCeZRcLfZpFErA75cfLkSY0SMaQeP2mRSjspwSrMTEqzFia%2Fa8bMWXA3Lo3A19M6gEK5cURz4Vu6EQVyrzbz5ZzdwoV3%2BR7lgxJDqm94N1QGhVhx94Il65RY7Vy3SMhaDbe8zlDHMygnvf5xuJc9oLrcU4xumhxODhw%2BiROnz%2BP4uUtWOCUohw4fAcMek4YeOSQZu%2FlLNlik0qtdvqB6tEkulyuC1Bk3ASI49%2F3mN0h2F017T2V%2F7r%2BXL1%2BO4IOnYR5%2BsovnygvP%2FciW07O5w5qwbU7MZmFwLzREUzcjI0PvuvkdG8VOjdWfYZuR5uGHH9Yx2SfZV4EkmaO5MnE%2BfAhRfGtv4Uts74SvciHzJRfKgU1iSPUKmf7hXSqB5buVrIhQ3DYM6viGHlQp6N%2BpwjpX%2FRJLl57nn9uCwqYOFXv4dcmd0eUNKFkuOf7nl9bB07Zc7bk6bpFKL4vLyLMeIQgMT5bG%2B9g%2FFApZYYxt9j2VeiSb91KGcnPXNayaQw51eFLPqWxFVl2nddqmZ3IM7olMFy5cwOnTp3Hk6DErJDO08vD037JIHb4QclsGLFI1%2FIquCb%2BGVHNAMvPgwqCHE2eDw93w1fPOghtcUAwPzGM9dWAcflEKCMBBEjsoq0BWhRqRvdUn7UaoR7Hq%2BsRjaxdqKHVKGHV3yQFLxLV4fUT4jRei3B0jyK9s1vA8W%2FZBr%2FTlmO4lkbokyrwsRZNqv9Qz%2FCYXhJHiu%2BVFDL%2B82HPvNHvY5OSknoiZSJr9pMznxvSieo0eTOFwGHlNfRZJ%2B%2FbtQ9%2FwKvQOrbQOT%2FTCzqXd6BaPLFm6DnnNt0jlqdlXNtdaFBwrMfvGixjnTntmXkpsuM7C3mA7Hb7TcWHnJfagJJdn38BOMT4upJLYB4XYnfAsGNK6OwlfiDxdGxGsb4dT9j672D3VXn%2F46HH8%2BZW%2FIkMu3j65%2BBfIs5nZU6P3rWhSuR%2FylLl69WpkBivh7tmKFH%2BFRVRjY6OC99FHH6nOH8TLqG88lNemJNkHeYrW%2FU76mnDO16KEHDd6V63DwYMHrUWQIecF%2BxgkI69pmYqnezMcNk%2Blzd4Va63%2BPFzZw3aybQFygO7ubuQ29OhLGyUaa60TjMgFOaJ4xBmMGP0YUguHxvW5jML30NDwhD6AM6ewzte3w9Khnv13tjx7bR0bxzU%2B89lEf%2FNKI%2Fl0MrFnHzLlfso93H6oMp7Kvgyj3LvsD%2BTphdXIqVmsjxqcS6o%2F0lNnzJql9%2BPEXI%2FlXQSQxKZnyQtP71Zke0MgWc7WIevNl69Ys3MLIvqQQEdzX8QYenJt6dexiQPbzZ5MAt%2BS1yx70ocYeQShnrd7FFkOl86FCytJxvPfxJY4U6Lxtdebsl2Pc4ghNSSk8igdkBVBYZl1RSSXxJL0m2280lDMb5NnVS7AzOR0OeWJMDdl%2FraLaZOcDw7s7xd7fnnI4F5GAo1N9kt2iffPH0RrRw88Hg88sgCix3bL4aF2cZ%2F2p50AQbo530QBjWRxf00joeJZbNNc9LwSZcp7N6C5uRn5zUKUtM3OKVD9uro6qetTPHLrOrB%2BbI96f3nnSnmJGrFw8MiZoKpvRPd6d2WTvgezP8ctKyuThxg38uUbzJzccvAsLquEI1Ai8xiNwX46fA0vJrfzxbpYUuVFo2hop%2F6ZK8jXIxGWWVc8LORKbtqjdULSl3V%2B8RrTl2Xz215mu6lnP9OX9QHpw6uRGTvarlNCHMG4nV2XPOyzP1%2B%2F7HZpzynEOBq6wQv7dPPlX00cEkrN%2FDgG9V2tgxHzdQixuTWL5GohL2k3cTLz9csV0CNXOl4FWcf%2BjqZeOOVgw4UYjYOrfSV4VYnGIdru3fA1%2BjGk8pnKCB%2Fl7VIshIaFWOb6nCXtBM6I0bX%2FtrezTMJMHctG2Jc2o3WUmJvzuGf3Bh93woFt0%2F5LS5F0DNMzSTABFUXmpp5tpp1tdonWZ1tQyIvWMzaj%2B5r%2B9%2BzewP2X4hBBqPkPtHv%2FTfjr%2Fk%2FKmP8mtBN77%2F9%2Bf%2F3%2F9%2Ft%2FvEgNj58p078AAAAASUVORK5CYII%3D",
	ajax_load: "data:image/gif;base64,R0lGODlhIAAgAPUAAP%2F%2F%2FwAAAPr6%2BsTExOjo6PDw8NDQ0H5%2Bfpqamvb29ubm5vz8%2FJKSkoaGhuLi4ri4uKCgoOzs7K6urtzc3D4%2BPlZWVmBgYHx8fKioqO7u7kpKSmxsbAwMDAAAAM7OzsjIyNjY2CwsLF5eXh4eHkxMTLCwsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAIAAgAAAG%2F0CAcEgkFjgcR3HJJE4SxEGnMygKmkwJxRKdVocFBRRLfFAoj6GUOhQoFAVysULRjNdfQFghLxrODEJ4Qm5ifUUXZwQAgwBvEXIGBkUEZxuMXgAJb1dECWMABAcHDEpDEGcTBQMDBQtvcW0RbwuECKMHELEJF5NFCxm1AAt7cH4NuAOdcsURy0QCD7gYfcWgTQUQB6Zkr66HoeDCSwIF5ucFz3IC7O0CC6zx8YuHhW%2F3CvLyfPX4%2BOXozKnDssBdu3G%2FxIHTpGAgOUPrZimAJCfDPYfDin2TQ%2BxeBnWbHi37SC4YIYkQhdy7FvLdpwWvjA0JyU%2FISyIx4xS6sgfkNS4me2rtVKkgw0JCb8YMZdjwqMQ2nIY8BbcUQNVCP7G4MQq1KRivR7tiDEuEFrggACH5BAkKAAAALAAAAAAgACAAAAb%2FQIBwSCQmNBpCcckkEgREA4ViKA6azM8BEZ1Wh6LOBls0HA5fgJQ6HHQ6InKRcWhA1d5hqMMpyIkOZw9Ca18Qbwd%2FRRhnfoUABRwdI3IESkQFZxB4bAdvV0YJQwkDAx9%2BbWcECQYGCQ5vFEQCEQoKC0ILHqUDBncCGA5LBiHCAAsFtgqoQwS8Aw64f8m2EXdFCxO8INPKomQCBgPMWAvL0n%2Fff%2BjYAu7vAuxy8O%2FmyvfX8%2Ff7%2FArq%2Bv0W0HMnr9zAeE0KJlQkJIGCfE0E%2BPtDq9qfDMogDkGmrIBCbNQUZIDosNq1kUsEZJBW0dY%2Fb0ZsLViQIMFMW%2BRKKgjFzp4fNokPIdki%2BY8JNVxA79jKwHAI0G9JGw5tCqDWTiFRhVhtmhVA16cMJTJ1OnVIMo1cy1KVI5NhEAAh%2BQQJCgAAACwAAAAAIAAgAAAG%2F0CAcEgkChqNQnHJJCYWRMfh4CgamkzFwBOdVocNCgNbJAwGhKGUOjRQKA1y8XOGAtZfgIWiSciJBWcTQnhCD28Qf0UgZwJ3XgAJGhQVcgKORmdXhRBvV0QMY0ILCgoRmIRnCQIODgIEbxtEJSMdHZ8AGaUKBXYLIEpFExZpAG62HRRFArsKfn8FIsgjiUwJu8FkJLYcB9lMCwUKqFgGHSJ5cnZ%2FuEULl%2FCX63%2Fx8KTNu%2BRkzPj9zc%2F0%2FCl4V0%2FAPDIE6x0csrBJwybX9DFhBhCLgAilIvzRVUriKHGlev0JtyuDvmsZUZlcIiCDnYu7KsZ0UmrBggRP7n1DqcDJEzciOgHwcwTyZEUmIKEMFVIqgyIjpZ4tjdTxqRCMPYVMBYDV6tavUZ8yczpkKwBxHsVWtaqo5tMgACH5BAkKAAAALAAAAAAgACAAAAb%2FQIBwSCQuBgNBcck0FgvIQtHRZCYUGSJ0IB2WDo9qUaBQKIXbLsBxOJTExUh5mB4iDo0zXEhWJNBRQgZtA3tPZQsAdQINBwxwAnpCC2VSdQNtVEQSEkOUChGSVwoLCwUFpm0QRAMVFBQTQxllCqh0kkIECF0TG68UG2O0foYJDb8VYVa0alUXrxoQf1WmZnsTFA0EhgCJhrFMC5Hjkd57W0jpDsPDuFUDHfHyHRzstNN78PPxHOLk5dwcpBuoaYk5OAfhXHG3hAy%2BKgLkgNozqwzDbgWYJQyXsUwGXKNA6fnYMIO3iPeIpBwyqlSCBKUqEQk5E6YRmX2UdAT5kEnHKkQ5hXjkNqTPtKAARl1sIrGoxSFNuSEFMNWoVCxEpiqyRlQY165wEHELAgAh%2BQQJCgAAACwAAAAAIAAgAAAG%2F0CAcEgsKhSLonJJTBIFR0GxwFwmFJlnlAgaTKpFqEIqFJMBhcEABC5GjkPz0KN2tsvHBH4sJKgdd1NHSXILah9tAmdCC0dUcg5qVEQfiIxHEYtXSACKnWoGXAwHBwRDGUcKBXYFi0IJHmQEEKQHEGGpCnp3AiW1DKFWqZNgGKQNA65FCwV8bQQHJcRtds9MC4rZitVgCQbf4AYEubnKTAYU6eoUGuSpu3fo6%2Bka2NrbgQAE4eCmS9xVAOW7Yq7IgA4Hpi0R8EZBhDshOnTgcOtfM0cAlTigILFDiAFFNjk8k0GZgAxOBozouIHIOyKbFixIkECmIyIHOEiEWbPJTTQ5FxcVOMCgzUVCWwAcyZJvzy45ADYVZNIwTlIAVfNB7XRVDLxEWLQ4E9JsKq%2BrTdsMyhcEACH5BAkKAAAALAAAAAAgACAAAAb%2FQIBwSCwqFIuicklMEgVHQVHKVCYUmWeUWFAkqtOtEKqgAsgFcDFyHJLNmbZa6x2Lyd8595h8C48RagJmQgtHaX5XZUYKQ4YKEYSKfVKPaUMZHwMDeQBxh04ABYSFGU4JBpsDBmFHdXMLIKofBEyKCpdgspsOoUsLXaRLCQMgwky%2BYJ1FC4POg8lVAg7U1Q5drtnHSw4H3t8HDdnZy2Dd4N4Nzc%2FQeqLW1bnM7rXuV9tEBhQQ5UoCbJDmWKBAQcMDZNhwRVNCYANBChZYEbkVCZOwASEcCDFQ4SEDIq6WTVqQIMECBx06iCACQQPBiSabHDqzRUTKARMhSFCDrc%2BWNQIcOoRw5%2BZIHj8ADqSEQBQAwKKLhIzowEEeGKQ0owIYkPKjHihZoBKi0KFE01b4zg7h4y4IACH5BAkKAAAALAAAAAAgACAAAAb%2FQIBwSCwqFIuicklMEgVHQVHKVCYUmWeUWFAkqtOtEKqgAsgFcDFyHJLNmbZa6x2Lyd8595h8C48RagJmQgtHaX5XZUUJeQCGChGEin1SkGlubEhDcYdOAAWEhRlOC12HYUd1eqeRokOKCphgrY5MpotqhgWfunqPt4PCg71gpgXIyWSqqq9MBQPR0tHMzM5L0NPSC8PCxVUCyeLX38%2B%2FAFfXRA4HA%2BpjmoFqCAcHDQa3rbxzBRD1BwgcMFIlidMrAxYICHHA4N8DIqpsUWJ3wAEBChQaEBnQoB6RRr0uARjQocMAAA0w4nMz4IOaU0lImkSngYKFc3ZWyTwJAALGK4fnNA3ZOaQCBQ22wPgRQlSIAYwSfkHJMrQkTyEbKFzFydQq15ccOAjUEwQAIfkECQoAAAAsAAAAACAAIAAABv9AgHBILCoUi6JySUwSBUdBUcpUJhSZZ5RYUCSq060QqqACyAVwMXIcks2ZtlrrHYvJ3zn3mHwLjxFqAmZCC0dpfldlRQl5AIYKEYSKfVKQaW5sSENxh04ABYSFGU4LXYdhR3V6p5GiQ4oKmGCtjkymi2qGBZ%2B6eo%2B3g8KDvYLDxKrJuXNkys6qr0zNygvHxL%2FV1sVD29K%2FAFfRRQUDDt1PmoFqHgPtBLetvMwG7QMes0KxkkIFIQNKDhBgKvCh3gQiqmxt6NDBAAEIEAgUOHCgBBEH9Yg06uWAIQUABihQMACgBEUHTRwoUEOBIcqQI880OIDgm5ABDA8IgUkSwAAyij1%2FjejAARPPIQwONBCnBAJDCEOOCnFA8cOvEh1CEJEqBMIBEDaLcA3LJIEGDe%2F0BAEAIfkECQoAAAAsAAAAACAAIAAABv9AgHBILCoUi6JySUwSBUdBUcpUJhSZZ5RYUCSq060QqqACyAVwMXIcks2ZtlrrHYvJ3zn3mHwLjxFqAmZCC0dpfldlRQl5AIYKEYSKfVKQaW5sSENxh04ABYSFGU4LXYdhR3V6p5GiQ4oKmGCtjkymi2qGBZ%2B6eo%2B3g8KDvYLDxKrJuXNkys6qr0zNygvHxL%2FV1sVDDti%2FBQccA8yrYBAjHR0jc53LRQYU6R0UBnO4RxmiG%2FIjJUIJFuoVKeCBigBN5QCk43BgFgMKFCYUGDAgFEUQRGIRYbCh2xACEDcAcHDgQDcQFGf9s7VkA0QCI0t2W0DRw68h8ChAEELSJE8xijBvVqCgIU9PjwA%2BUNzG5AHEB9xkDpk4QMGvARQsEDlKxMCALDeLcA0rqEEDlWCCAAAh%2BQQJCgAAACwAAAAAIAAgAAAG%2F0CAcEgsKhSLonJJTBIFR0FRylQmFJlnlFhQJKrTrRCqoALIBXAxchySzZm2Wusdi8nfOfeYfAuPEWoCZkILR2l%2BV2VFCXkAhgoRhIp9UpBpbmxIQ3GHTgAFhIUZTgtdh2FHdXqnkaJDigqYYK2OTKaLaoYFn7p6j0wOA8PEAw6%2FZ4PKUhwdzs8dEL9kqqrN0M7SetTVCsLFw8d6C8vKvUQEv%2BdVCRAaBnNQtkwPFRQUFXOduUoTG%2FcUNkyYg%2BtIBlEMAFYYMAaBuCekxmhaJeSeBgiOHhw4QECAAwcCLhGJRUQCg3RDCmyUVmBYmlOiGqmBsPGlyz9YkAlxsJEhqCubABS9AsPgQAMqLQfM0oTMwEZ4QpLOwvMLxAEEXIBG5aczqtaut4YNXRIEACH5BAkKAAAALAAAAAAgACAAAAb%2FQIBwSCwqFIuicklMEgVHQVHKVCYUmWeUWFAkqtOtEKqgAsgFcDFyHJLNmbZa6x2Lyd8595h8C48RahAQRQtHaX5XZUUJeQAGHR0jA0SKfVKGCmlubEhCBSGRHSQOQwVmQwsZTgtdh0UQHKIHm2quChGophuiJHO3jkwOFB2UaoYFTnMGegDKRQQG0tMGBM1nAtnaABoU3t8UD81kR%2BUK3eDe4nrk5grR1NLWegva9s9czfhVAgMNpWqgBGNigMGBAwzmxBGjhACEgwcgzAPTqlwGXQ8gMgAhZIGHWm5WjelUZ8jBBgPMTBgwIMGCRgsygVSkgMiHByD7DWDmx5WuMkZqDLCU4gfAq2sACrAEWFSRLjUfWDopCqDTNQIsJ1LF0yzDAA90UHV5eo0qUjB8mgUBACH5BAkKAAAALAAAAAAgACAAAAb%2FQIBwSCwqFIuickk0FIiCo6A4ZSoZnRBUSiwoEtYipNOBDKOKKgD9DBNHHU4brc4c3cUBeSOk949geEQUZA5rXABHEW4PD0UOZBSHaQAJiEMJgQATFBQVBkQHZKACUwtHbX0RR0mVFp0UFwRCBSQDSgsZrQteqEUPGrAQmmG9ChFqRAkMsBd4xsRLBBsUoG6nBa14E4IA2kUFDuLjDql4peilAA0H7e4H1udH8%2FPs7%2B3xbmj0qOTj5mEWpEP3DUq3glYWOBgAcEmUaNI%2BDBjwAY%2BdS0USGJg4wABEXMYyJNvE8UOGISKVCNClah4xjg60WUKyINOCUwrMzVRARMGENWQ4n%2FjpNTKTm15J%2FCTK2e0MoD%2BUKmHEs4onVDVVmyqdpAbNR4cKTjqNSots07EjzzJh1S0IADsAAAAAAAAAAAA%3D",
	panel_icon_attack: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABnklEQVRoQ%2B2Y0W3DMAxEPUXz6wE6U1bJJO2qahiEBUGIsoOcgVN8AQQbjkTw8U6y5KW1tpypnQrWhBXwp9tbCkvhD1vFZWlZWpaee2emOaw5rDlcz%2BHl%2Bfu9XlvVfu7%2FebM%2B8b43xmPaFeE%2BSBBPxJKypNvtBmsWz6HpgNGwXjiHPhXwuq533vdfiVBLVwo%2Fpt%2FA5vF%2Fu%2FcWFaYGzklXwLHfaIwVkhrYlKlUy%2Bp5v3jN8FMBV4Bu10rZWLCpgHtq92BjYfIUoAW2TUSGGQHHvt4vW9ue0wNnG2eYvGL3Fq%2FYxwpJv2hVUPF5tUpPuWj1rL1H6d77mtbSR24tKS191OHBYGmBHXp0RBxtM%2FM4h6U9HvpRzhPtXXvAo%2F60x0NPbOuagb%2B%2BL83a5ji209JWwv9KhZPTXlh6S4%2FgXeFXYKcHfhV2amBLfs%2BczS6h%2B%2BKBSOjoGNBPPEcni4gvYEQVmWNIYWZ1ELlJYUQVmWNIYWZ1ELlJYUQVmWNIYWZ1ELlJYUQVmWNIYWZ1ELlJYUQVmWNIYWZ1ELlJYUQVmWP8AcN%2BoLDY6wKSAAAAAElFTkSuQmCC",
	panel_icon_camp: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABnklEQVRoQ%2B1Y0Q7CIAzcV%2Bij%2BwB%2FWX8V17kuTQNsZjQ55JaQaYTmrncF6pRSmkYaQ5EVYUn43%2B1Nhanwn%2B3itDQtTUv3fTNjDbOGWcPlGp625%2F14pNJ4Lb%2FpkDn2c26NxpR3C%2Fc1CaJABJSAXnuSRkPiKWk4wq3JatKU9FCE53le%2BF4%2FEptaeldYoOljrb1CNnb38%2Bx3M1fi4hNe95jKk0uET8g2py%2FCSrz0tk7oWmGrVk5omwBVeyiFS%2B5fkgFrablEfP8X3DYn%2By7YtTjfxOmP8IFliwna1r2WIwl%2Fl66pmzuefE13eSz562XpHPZHmHMErKUjr5aQlo5qHoQsLGElXWsRa52UX6dkYdtDbeUUaO6dI1ybD9se2ma99tkTvj3vScbRejndr47LASyAI8C7Umb3PksW3tJnFP6FbPeEfyXbNWEBf6ZmvUuu1q%2Fe8JvWcQtQkTGGIkuFI62EEpuWRlEiCgcVjsosSlwqjKJEFA4qHJVZlLhUGEWJKBxUOCqzKHGpMIoSUTiocFRmUeJSYRQlonBQ4ajMosT9AOMjpm6nfRYqAAAAAElFTkSuQmCC",
	panel_icon_meeting: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABlUlEQVRoQ%2B2XXY7CMAyEewp47QH2TFyFB87Rvc%2BeKmAJo5BNgium0qQdpKihTSx%2FHjs%2FU0ppOlI7FKwJK%2BC9p7cUlsI7W8WV0kpppfTYJzPVsGpYNdyu4en5u9x%2BU7stj2%2FebFze%2Fz%2FPbdoTkX0QI%2B6IOWWg178Ea2bPoemA0bAeOIc%2BFPA8zw%2Fe77dEaEq3FLbyq6V57X3tndkdBtgBetD2rdUsUMMAl5AtaFc%2F%2F5736YFdLQPJlcv%2Fez%2BHrY0dSuHI9vRJdXLg5bU4farLMhhlrQ%2BS0u%2FAkZW5BfoOvPCv0tGtKAY8wLYUSenalpW%2F8z79Kh1ZrNaMoQXe6vJgpyzKk5bfavrXw%2F5tqpzrsGab7iztwPZ0R2vPWjr3xrtdauAcvuyXwKefc7LWm0OvcBQ4CrsL4DWwwwOvhR0a2JyP1GxZFnSLFsKhrW1A9ratnUTaFzAymoy2pDCjKkifpDAymoy2pDCjKkifpDAymoy2pDCjKkifpDAymoy2pDCjKkifpDAymoy2pDCjKkifpDAymoy27hfIDn9qDe0GAAAAAElFTkSuQmCC",
	panel_icon_backup: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABn0lEQVRoQ%2B1XQW6EMAzkFe2xPKAf63%2F2uv1qGq%2FWK8sNgRWDNIFBikCQWDOeiYmnUsp0pXEpsiasCJ%2Fd3lJYCp%2BsisvSsrQsPfbJTHtYe1h7eHkPT8%2Fr6%2Be3LI97%2FebD5sXn%2F%2Bs8pt0R7oMEcSAGyohOt2oL0HjEe150hNFkPWlO%2BlKE53mufPf%2FEqGWjgo%2F0G20dZzbWmdxhyNsROJlyVi7oqWpCS%2BRcwJZxZbC8d1QCjvwJVIt1V39YRSOgHuEe%2FM8ETaHWOH7q1Blomu2jQTz2lMR7hUut%2FRcT2P0RSsXqN6vp%2FUrGqpoRUvm52zdVsXO74gtjT1H01fpo5oH27%2BUe3hbe9h3QW4rnSxte%2BikHWjr3jpjd%2BeztoexWe8%2Bp6bi4%2Fuz2FhbX4vZ7mZnd4AIYg3w63sgvJUsvaW3KPwO2eEJv0t2bMIV%2FZY9m11Ct4cRgI6OAS1aR4NFxBdhRBaZY0hhZnUQ2KQwIovMMaQwszoIbFIYkUXmGFKYWR0ENimMyCJzDCnMrA4CmxRGZJE5hhRmVgeBTQojssgc4w9h8yaY0IWzdAAAAABJRU5ErkJggg%3D%3D",
	panel_icon_develop: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABhElEQVRoQ%2B2YQQ7CMAwE%2Bwo40hMnTvAfvsLTA5awFBm3BLGVNulWigppsDxeO6mZSinTnsauYE1YAY%2Be3lJYCg%2B2iyulldJK6b7fzFTDqmHV8HINT%2B%2Frej8V1HCbdkdkH8SIO2JOGej5McGG2XNoOmA0rAfOoXcFPM%2Fzi%2Ff%2FIxGa0q6weVZfplQ25%2FOu5Mei14Q9M7v0wDVEBhafL33vBrhF4bgmBqau4W4UznZsAx1O4axuHTQC1%2FNZrQ9Tww4XN62ofjfAS7tultJL6hv87T6Pt0uvAXelcHY8xZqtN7Yuaxj5Lk19Dm%2FVPNgZTHkOt7aHaxkQ20qHpW0PHdodze4Z8Np62vawbtbXPkfgw%2BVYbHz7PV239M1hf14Dt8LSp3SLwr%2FAdg%2F8K2zXwOZ8S83GLKGrYYRDW9uA%2FsWztbMI%2BwJGRJHZhhRmVgfhmxRGRJHZhhRmVgfhmxRGRJHZhhRmVgfhmxRGRJHZhhRmVgfhmxRGRJHZhhRmVgfhmxRGRJHZxhMvxkW5HqATDgAAAABJRU5ErkJggg%3D%3D",
	panel_icon_return: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABhElEQVRoQ%2B2YUYrDMAxEc4rd3xxgD5scMudwK1iBMI7t0AmMmikYb3Eq9DSSYu1SSlmetB4Fa8IK%2BNvTWwpL4S%2Fr4kpppbRSOvfNTDWsGlYNn9fw8v%2FZ972gltu0HZF9ECPuiDlloMdxwJbZc2g6YDSsB86hHwW8ruub9%2FNXIjSla4Wt7Ewl2%2BNy5fy89Uw8M7vUwBG0B%2Bxnvd3O0gHHJhaVi0rXWeDf0wH3QHqBSJ3SMWXr9D2r81TAs6naCkRMZYemr%2BFRE6q78%2Bj5bdu4u%2FSo%2B7aAz15VqZrWTHc%2Bewen6tLIuzS1wncND3bLorxpzY6HvQyox0qHpR0PHdodbe0t4N7ztONhHNZ7f9fAP3%2B%2Fxdbo93TT0shhP4%2FAs7D0KT2j8BXY9MBXYVMDm%2FMzNVtnCV0NIxy62wb0Xzx3O4uwL2BEFJltSGFmdRC%2BSWFEFJltSGFmdRC%2BSWFEFJltSGFmdRC%2BSWFEFJltSGFmdRC%2BSWFEFJltSGFmdRC%2BSWFEFJltvADqXTvBIRzHOwAAAABJRU5ErkJggg%3D%3D",
	panel_icon_wait: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwAAADsABataJCQAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABkklEQVRoQ%2B1YbQ7CMAjdUXYyf3oNb%2BAN9Kq1JGIIgQUzksH2TJp9tEUe74HUZYyxXGlcCiwRC8BnlzcYBsMnq%2BKQNCQNSffuzJDDyGHkMHK4VR1o5WxGfQHgjChWtgGGK7OT4RsYzohiZRtgeA87y%2Fdze9%2BHO15zjgetk%2FfGPrZJ1z2%2B8d4UIz9j0ykC%2BhjPtEH2GHQ5wNlgOXAM%2BlKA13WdePcfXFIlrRmmtJPy1s80J9%2FRPT%2FL92S3PGALCAPScxK4Bbo8YIslzSY%2Fa4DtGZasnpphK1%2B9nPWCwjbqSno2EVykpDQtQFLSViBksWsFWDchXuX2cpn2UzfWrkpr5i0leO%2FqMizaSu8312LY%2B5mqn8PJfbRsLUtKmpr87H6a5VwWMIPePCJuHR%2FVHAGlQXbL9dJ8jKMrO5pxZbulAUvw8j7qtLU%2FundrXYpM5B8AHtB%2FWQLg6jkMSX8jEM3DFpKOgjlyXWrROhJI9LsBOBqpruvAcFfmon6D4Wikuq4Dw12Zi%2FoNhqOR6roODHdlLur3BxHsB%2B21nhAAAAAAAElFTkSuQmCC",
	panel_icon_backup_wait: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwAAADsABataJCQAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABYUlEQVRoQ%2B2YYQrCMAyFexP3ywPofbyKR68LGAmhjkLf4LV7gzKdMeTLS7O2pdZarjQuBWvCCnj18pbCUnixLq6SVkmrpOdemWkOaw5rDmsOT9UHpgoW0V8EjMgisw8pzKwOIjYpjMgisw8pPKJO%2BV6P162ihvu0%2B0hs%2Fl%2BIk5%2BzPSgDvb8LbJg%2Fh6YDRsN64hz6UsDbtu284xsXaElHhS263tLOtvm7%2BZ0O2CDi5cmIcNnGf6MHbsFlMAP2Z0sp3IL6Bz%2Btwi31jiBbcz3a05d0L3C2W17hCJxVjgo%2FXxt3lz5qUBmyZZtt6Es6Nqr82cu29VqKz6abw72Ljh47WoVtkY9eTzss5UrrjO2hgdqg3R46tAeKuNNuD%2BNmHRFk9ke3WxLw4LGMFGY7ALhcSSOaytk%2BoEc8ZweL8C9gRBaZfUhhZnUQsUlhRBaZfUhhZnUQsUlhRBaZfUhhZnUQsX0AjRDndd8mT5YAAAAASUVORK5CYII%3D",
	panel_icon_move: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABiUlEQVRoQ%2B2Y0W3DMAxEPUXzWQ%2FQSZIB%2BpdVMrpaAiFACLIkt2fgaJ8BwQriEHy8o2RlKaUsVxqXgjVhBXx2e0thKXyyVVyWlqVl6dxvZuph9bB6eLuHl%2Fd1%2F3wW1PCYdke4DxLEE7GkDPR7ecGGxXNoOmA0rBfOoS8FvK7rL%2B%2F%2Ft0SopV1hy2x0Rdvbs%2F45zqPC9MC9PnYoL0qEjYVKB9xS2SBairbg0wFv2bRWuC5AbWtrlRSW%2FqvCta3TANcKR2Xd2j0r%2B%2FNpgEcKR9ituRXmsSax9NZKPdqGUvbw7D7cW8DSrNLId2mLRdvDRx0ebEui3JZmj4c9B9THSoelPR46tCfaureAe8%2FTHg%2FjYb03r4E%2Fvm7Fxuj3dKelUcL%2BfQSehaW39IzCe2DTA%2B%2BFTQ1syc%2F0bO0Suh5GJHR0DOhfPEcni4gvYEQVmWNIYWZ1ELlJYUQVmWNIYWZ1ELlJYUQVmWNIYWZ1ELlJYUQVmWNIYWZ1ELlJYUQVmWNIYWZ1ELlJYUQVmWP8AGBseBevbWf5AAAAAElFTkSuQmCC",
	panel_icon_enemy: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABvklEQVRoQ%2B2Y623DMAyEPUX7Mx6gw7bbdYHMoZpFDz0QihWbiSXGF0BQHqLFj0fqkamUMp2pnQrWhBXwq6e3FJbCL7aKK6WV0krp3Ccz1bBqWDWsGk61DqRy9hHri4AfEcWRnxFSePp7fV0u5dkNc1kfCWjMeJncQK%2BLD89uNg%2BguwEfBYtgAnoo4PL9rza%2F9xlw7zi2M%2BB5nhfe%2FWeBUEqzwgZQa1Zy7PStcfjejx0W2Bwzp3%2FXFOoZEM7XxrGdH8cpnUJhAAJqTWXOCNgNC1xTd005r7SNTQXslQOsKQSQrTXMARhu0fIK19QFPMBrNrxQDQ3sIbD1%2BC2Ix7HynAlYBNn2c9mShlq0UIOsmgdiEL8V1fZtruuhUtqr0%2FrMweG09fv20PvwEefprilth%2FmjztNI5%2B7AgL73eriWBWvPMFBr3a%2BHuLLBoVZfA27ZMOwwwABv9R747eO9WGvZ8e%2FdbktbnMRYBt4Dm1bhvbApgSOw6YDN4a0160unWw1HJu5lG%2FqLp5fTkXkFHIleBlspnEGliI9SOBK9DLZSOINKER%2BlcCR6GWylcAaVIj5K4Uj0MthK4QwqRXw8ncI%2FGQcpBWguhl4AAAAASUVORK5CYII%3D",
	panel_icon_sortie: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAAB0ElEQVRoQ%2B2YYW6DMAyFOcX2lwPsDr0ZXI2bZRj1VU9RQhjuiF1cKSJtMfHnZ5vAkFIa7jRuBSvCBvCnp3coHAp%2FWBePlI6UjpT2vTOLGo4ajhqOGnbVB1w5%2B47%2BEsDviKLla6gUHp6feZ7TkTFNU8KQ83nessdactQEVGe8Li6OLsvy70PWAXQ34KtgEVBAmwGWV2Rwrjav%2Fb%2B9XiP7UtYI8DiOK%2B%2F5vYAqpXOFxeH58dig9%2BaA46PYsQ2uweAugTkYAMwDwFmAAMpvJoFL6pWUw3msLM4rZYlJ4M2pNTUZAt8ZoqQo6pcVzQNlSuG84ezVY64qbPPGZQ5YNg61eisB5%2BqVlEZGvG5FzyZoIqXPANdqnH%2FnIHLmyHpmbktHQKAw1zU3qrzeuSeYUDi%2FD7PDtXlxQ0Fpu7dNNdW0rtpPd01p2cxftZ%2BGut2BAd16vMP%2FrZStXUdAZXR%2FPMQjGxxqHUvALRuGNQPMD%2Bh78xz46%2Bc7yThq7xr4DKxb4LOwLoE1sO6AxeG%2F1mxe393eeGgW7mWresXTy2nNugGsiZ4H21DYg0oaH0NhTfQ82IbCHlTS%2BBgKa6LnwTYU9qCSxsdQWBM9D7ahsAeVND7eTuFffOCKYCMXyakAAAAASUVORK5CYII%3D",
	panel_icon_bmcoord: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6%2FNlyAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn%2FAACA6QAAdTAAAOpgAAA6mAAAF2%2BSX8VGAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGnRFWHRTb2Z0d2FyZQBQYWludC5ORVQgdjMuNS4xMDD0cqEAAAKPSURBVGhD7ZhNTxNRFIZfweDGlWs3snXhzsRfoIl%2FipV%2FQaExfoAhVqWICC0YhlYliBqxpihiQ7BYUWxgpNSWfhzf27mDlRDapdecJm9uZzpN7vOcmTN3BtCPGlADakANqAE1oAbUgBpQA2pADagBNaAG1IAaUANqQA2oATWgBtSAGlAD7hpIRXBhth8VZjkTRY%2B7JB3OnKBLjCwOQr6NoZyLobfDv7p3mHcV5wxskilNQ2QW4k9iWzwcb6WRPnS5R3fIjAm7YICXhgNYSQVjbgQ73J9jiky9KWUAwyI45iw4AXoNiEkxQdAk4zPzAXQ2Clm%2BC1l7ANkYg2xNQjYfIecsMEE9A%2Fvujq1uhqMwO38q3ax6S3YTKDkJTNCbYXX9uIUyoAbYxFR6lckzBeZlcEw%2Bhj6ngJMRnCXo1xA2e9%2FCpltgQ%2Bhw3LTNLI7vTsF6%2FbgSNqD567wmJyzsM3saHwQ123XmBaTB6q6P4KIzwGE3NpX9wI5c8yzsW47lI6q7Fhz3YxyvnIE1EyXoXmqAXXa85fazfgRoWO2nkOoM6l9Gcdop4OQ1XOJKqrHfcbc6gDXQrG5xCr5TsOFk5yI4n39ooc29ttQBNK%2Fv0hR%2BOQlsJs3FxhkuJIJKP2eKbaDnIJUnqDoLbK%2Fn3ew9ey2%2FbwPMDl2bQcN14MrCjUOAN7jvjc0iR9PB2bSaZ4PLa2h27NrrWxbkI8cG88luH1hKGtjtOFZdB26YZ99m5QywWWXxe3kae59juCxRdEsGPdx30k%2FgFGG7nT2lWd2uvx4YbEV%2FxlHIjf6nD%2F4EXtl%2F%2FiVw4THSKxM44WwV203cvL1ID%2BE2T%2BEqX%2BkMtTtef1cDakANqAE1oAbUgBr4Fwz8BnE4nhkujsJnAAAAAElFTkSuQmCC"
},

//. sounds
sounds: {
	enemy_raid: "data:video/ogg;base64,T2dnUwACAAAAAAAAAAAxNwAAAAAAAK0iScQBHgF2b3JiaXMAAAAAAcBdAAAAAAAAN7AAAAAAAACpAU9nZ1MAAAAAAAAAAAAAMTcAAAEAAACxrfujDj3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FFA3ZvcmJpcy0AAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDEwMTEwMSAoU2NoYXVmZW51Z2dldCkAAAAAAQV2b3JiaXMiQkNWAQBAAAAYQhAqBa1jjjrIFSGMGaKgQsopxx1C0CGjJEOIOsY1xxhjR7lkikLJgdCQVQAAQAAApBxXUHJJLeecc6MYV8xx6CDnnHPlIGfMcQkl55xzjjnnknKOMeecc6MYVw5yKS3nnHOBFEeKcacY55xzpBxHinGoGOecc20xt5JyzjnnnHPmIIdScq4155xzpBhnDnILJeecc8YgZ8xx6yDnnHOMNbfUcs4555xzzjnnnHPOOeecc4wx55xzzjnnnHNuMecWc64555xzzjnnHHPOOeeccyA0ZBUAkAAAoKEoiuIoDhAasgoAyAAAEEBxFEeRFEuxHMvRJA0IDVkFAAABAAgAAKBIhqRIiqVYjmZpniZ6oiiaoiqrsmnKsizLsuu6LhAasgoASAAAUFEUxXAUBwgNWQUAZAAACGAoiqM4juRYkqVZngeEhqwCAIAAAAQAAFAMR7EUTfEkz%2FI8z%2FM8z%2FM8z%2FM8z%2FM8z%2FM8z%2FM8DQgNWQUAIAAAAIIoZBgDQkNWAQBAAAAIIRoZQ51SElwKFkIcEUMdQs5DqaWD4CmFJWPSU6xBCCF87z333nvvgdCQVQAAEAAAYRQ4iIHHJAghhGIUJ0RxpiAIIYTlJFjKeegkCN2DEEK4nHvLuffeeyA0ZBUAAAgAwCCEEEIIIYQQQggppJRSSCmmmGKKKcccc8wxxyCDDDLooJNOOsmkkk46yiSjjlJrKbUUU0yx5RZjrbXWnHOvQSljjDHGGGOMMcYYY4wxxhgjCA1ZBQCAAAAQBhlkkEEIIYQUUkgppphyzDHHHANCQ1YBAIAAAAIAAAAcRVIkR3IkR5IkyZIsSZM8y7M8y7M8TdRETRVV1VVt1%2FZtX%2FZt39Vl3%2FZl29VlXZZl3bVtXdZdXdd1Xdd1Xdd1Xdd1Xdd1XdeB0JBVAIAEAICO5DiO5DiO5EiOpEgKEBqyCgCQAQAQAICjOIrjSI7kWI4lWZImaZZneZaneZqoiR4QGrIKAAAEABAAAAAAAICiKIqjOI4kWZamaZ6neqIomqqqiqapqqpqmqZpmqZpmqZpmqZpmqZpmqZpmqZpmqZpmqZpmqZpmqZpAqEhqwAACQAAHcdxHEdxHMdxJEeSJCA0ZBUAIAMAIAAAQ1EcRXIsx5I0S7M8y9NEz%2FRcUTZ1U1dtIDRkFQAACAAgAAAAAAAAx3M8x3M8yZM8y3M8x5M8SdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TQNCQ1YCAGQAABCTkEpOsVdGKcYktF4qpBST1HuomGJMOu2pQgYpB7mHSiGloNPeMqWQUgx7p5hCyBjqoYOQMYWw19pzz733HggNWREARAEAAMYgxhBjyDEmJYMSMcckZFIi55yUTkompaRWWsykhJhKi5FzTkonJZNSWgupZZJKayWmAgAAAhwAAAIshEJDVgQAUQAAiDFIKaQUUkoxp5hDSinHlGNIKeWcck45x5h0ECrnGHQOSqSUco45p5xzEjIHlXMOQiadAACAAAcAgAALodCQFQFAnAAAgJBzijEIEWMQQgkphVBSqpyT0kFJqYOSUkmpxZJSjJVzUjoJKXUSUiopxVhSii2kVGNpLdfSUo0txpxbjL2GlGItqdVaWqu5xVhzizX3yDlKnZTWOimtpdZqTa3V2klpLaTWYmktxtZizSnGnDMprYWWYiupxdhiyzW1mHNpLdcUY88pxp5rrLnHnIMwrdWcWss5xZh7zLHnmHMPknOUOimtdVJaS63VmlqrNZPSWmmtxpBaiy3GnFuLMWdSWiypxVhaijHFmHOLLdfQWq4pxpxTiznHWoOSsfZeWqs5xZh7iq3nmHMwNseeO0q5ltZ6Lq31XnMuQtbci2gt59RqDyrGnnPOwdjcgxCt5Zxq7D3F2HvuORjbc%2FCt1uBbzUXInIPQufimezBG1dqDzLUImXMQOugidPDJeJRqLq3lXFrrPdYafM05CNFa7inG3lOLvdeem7C9ByFayz3F2IOKMfiaczA652JUrcHHnIOQtRahey9K5yCUqrUHmWtQMtcidPDF6KCLLwAAYMABACDAhDJQaMiKACBOAIBByDmlGIRKKQihhJRCKClVjEnImIOSMSellFJaCCW1ijEImWNSMsekhBJaKiW0EkppqZTSWiiltZZajCm1FkMpqYVSWiultJZaqjG1VmPEmJTMOSmZY1JKKa2VUlqrHJOSMSipg5BKKSnFUlKLlXNSMuiodBBKKqnEVFJpraTSUimlxZJSbCnFVFuLtYZSWiypxFZSajG1VFuLMdeIMSkZc1Iy56SUUlIrpbSWOSelg45K5qCkklJrpaQUM%2BakdA5KyiCjUlKKLaUSUyiltZJSbKWk1lqMtabUWi0ltVZSarGUEluLMdcWS02dlNZKKjGGUlprMeaaWosxlBJbKSnGkkpsrcWaW2w5hlJaLKnEVkpqsdWWY2ux5tRSjSm1mltsucaUU4%2B19pxaqzW1VGNrseZYW2%2B11pw7Ka2FUlorJcWYWouxxVhzKCW2klJspaQYW2y5thZjD6G0WEpqsaQSY2sx5hhbjqm1WltsuabUYq219hxbbj2lFmuLsebSUo01195jTTkVAAAw4AAAEGBCGSg0ZCUAEAUAABjDGGMQGqWcc05Kg5RzzknJnIMQQkqZcxBCSClzTkJKLWXOQUiptVBKSq3FFkpJqbUWCwAAKHAAAAiwQVNicYBCQ1YCAFEAAIgxSjEGoTFGKecgNMYoxRiESinGnJNQKcWYc1Ayx5yDUErmnHMQSgkhlFJKSiGEUkpJqQAAgAIHAIAAGzQlFgcoNGRFABAFAAAYY5wzziEKnaXOUiSpo9ZRayilGkuMncZWe%2Bu50xp7bbk3lEqNqdaOa8u51d5pTT23HAsAADtwAAA7sBAKDVkJAOQBABDGKMWYc84ZhRhzzjnnDFKMOeecc4ox55yDEELFmHPOQQghc845CKGEkjnnHIQQSuicg1BKKaV0zkEIoZRSOucghFJKKZ1zEEoppZQCAIAKHAAAAmwU2ZxgJKjQkJUAQB4AAGAMQs5Jaa1hzDkILdXYMMYclJRii5yDkFKLuUbMQUgpxqA7KCm1GGzwnYSUWos5B5NSizXn3oNIqbWag8491VZzz733nGKsNefecy8AAHfBAQDswEaRzQlGggoNWQkA5AEAEAgpxZhzzhmlGHPMOeeMUowx5pxzijHGnHPOQcUYY845ByFjzDnnIISQMeaccxBC6JxzDkIIIXTOOQchhBA656CDEEIInXMQQgghhAIAgAocAAACbBTZnGAkqNCQlQBAOAAAACGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBC6JxzzjnnnHPOOeecc84555xzzjknAMi3wgHA%2F8HGGVaSzgpHgwsNWQkAhAMAAApBKKViEEopJZJOOimdk1BKKZGDUkrppJRSSgmllFJKCKWUUkoIHZRSQimllFJKKaWUUkoppZRSOimllFJKKaWUyjkppZNSSimlRM5JKSGUUkoppYRSSimllFJKKaWUUkoppZRSSimlhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEAgC4GxwAIBJsnGEl6axwNLjQkJUAQEgAAKAUc45KCCmUkFKomKKOQikppFJKChFjzknqHIVQUiipg8o5CKWklEIqIXXOQQclhZBSCSGVjjroKJRQUiollNI5KKWEFEpKKZWQQkipdJRSKCWVlEIqIZVSSkgllRBKCp2kVEoKqaRUUgiddJBCJyWkkkoKqZOUUiolpZRKSiV0UkIqKaUQQkqplBBKSCmlTlJJqaQUQighhZRSSiWlkkpKIZVUQgmlpJRSKKGkVFJKKaWSUikAAODAAQAgwAg6yaiyCBtNuPAAFBqyEgAgAwBAlHTWaadJIggxRZknDSnGILWkLMMQU5KJ8RRjjDkoRkMOMeSUGBdKCKGDYjwmlUPKUFG5t9Q5BcUWY3zvsRcBAAAIAgAEhAQAGCAomAEABgcIIwcCHQEEDm0AgIEImQkMCqHBQSYAPEBESAUAiQmK0oUuCCGCdBFk8cCFEzeeuOGEDm0QAAAAAAAQAPABAJBQABER0cxVWFxgZGhscHR4fICEBAAAAAAACAB8AAAkIkBERDRzFRYXGBkaGxwdHh8gIQEAAAAAAAAAAEBAQAAAAAAAIAAAAEBAT2dnUwAAgDsAAAAAAAAxNwAAAgAAAFOS9qkqAQELbnFsi15dcmNocFd0W2xJY2uKalhwSWp1i4tVa1xvcHFvbm5ucW9yAArWt%2Fm5iAFEAAAAAOwibherdJCAbSgfAEC5%2FvJSOKF18elFzTkVFuanCaWDUDC4%2BP8k3ckaNEGzufNoynI%2FNmL8feHp%2F6u6tScQpNH5he0EbqR%2B4ifTvrGuFiU%2FjBajl6v7Z9FybLPweRlNbp6F41IvYm0%2BNdNxdC0B%2FDTgRcuLpT2A2V8dAMAHcHEA0j5M%2BGaC08v%2B%2Fel3QlsnTc5NsHvduuzu%2FtcKKQDkSMWQh0QJTlb7%2F748cPkLm%2FagCEZkmfJF48f%2FRhMWJ190Oo0T5EYD0SDE%2FOVna7dGcgMAUK0nRp1M0IWj48jvYg00vavnT%2Fct2hg8AAAcuAC4P1MSACQwsYDj%2BdHmZOLnwWn2kGwJtPmYAQAAQP%2B0uwEBgSJQWtN5%2B9%2BSxijY01c%2BUhWQMtr8NZY6n1iuLzkUjqBBqdxt07ZwwSuJT2V%2BQ1xzbAQgAY767%2Fvp1wMy6VsfLuQr9Fzk0leYC4BEB5g8HdFLjAAk7i5pgBwYwblm93ef5ax7ZVQQpRPt3MUCvB2VgwjPhrnbDC2X2j2AqknCqd%2FfL%2Fk%2BXg07vQLsjLdkpxe4FAXYGbrf%2BBOWNWTc3eAYPwxB2Lx9gSLFx3XVWIUyX6Cbylls%2FH9%2FZ5GhZJkBAUADQCX6VLgW9LTTk1f0L%2B0BIOazJkAPjGmrAxMFuj2xPf3efpqnwTDss2F9uFfw6kYFAAAAAPLiizWiaevjsX0pL02neZoudjNU7v9PlsKB2KW9pafXRt9raD1cbicbEmAYds63BPSiu8vM9NOGAwAoTgMAkEIcCwAQP%2F07IZdqbD1YclBL%2Bd%2FOKIfhxUhTxPkwMzBLUvjfWYhWpbxK17Pex3bqSRoOAbD5Cwv0bVb1%2BUd33IP4ipmddZA71nQPjh%2B3F9JHuj%2F4SO%2FrrqIjrRkvwFoFhhEdzDVAJRU4lA6a3hhJz806AByC0G3TW1nQoAICv%2FQ1CATEVfvXCbMIlOLQia2fvyk1pp2Ab%2BNgAQEgdpj95O4IOuHT0oRXiqiSX2QR2HOKMEd7eYleaSVYloLV2%2B1wAeQopmO1pn0igWlnUwHw1dQ71w2bhM1v8OJiMG01briTo6%2BV365WOgIM4GClPq3cBIrHRrrxEdYhuV%2Fb2mmkIBrxeDz%2FtJ9dnuizI9jW5bz0bCVoLUFYf6U8DqaAJ2NrMXULAhS9k0srWksbAwAAcKAD2L%2BtBGgAimDrZGS6Ztw%2BDxNylYLU5ocoCQBAAGmuv5wgDQFZESC3y9nVz4eff20AgsYXUNLw%2Bu%2Be0MjAMMXFKQYs6M9Jde7RfMMCNABgOz7%2FJx23J6M%2BwhgDNL3rDJ%2F0LdoYdABxATggAHbzVx8AHAcTEmxurLN3vTC6qMUwH7ZQ25%2BkAQAAcPH3lxQEQLXi4iRg8f6l%2F5y%2FrionMdFFUBHJpbb2s8TR77UCRTVO0Ige3n6%2B1cwmon2pxUvf1Dh5egBBN0T%2F9bj2vBy%2FkzNeWbm0MQAAAH4AMfB5ONLZ9pA6Nw%2BmB%2BYCbQpDRgAAoIDX9tfTIJU%2F64enVeoigQCAtcN8PBOFk8q%2B5%2BrdCDHs%2Fdn1iDVkHr2b%2B%2BP27QFxtHW9BCS705M%2FeBdtDAAAwALpc24DAMBiS6BuHad%2FbR1uH2qbmTEgTjYcAAAAMIy3duzIeXv4X8dIiUrdOIoTL%2F8O9aqHOZ0eD1QczQPNNbh6OjHMHIrDJmw8WGnnX5YXxSCQAFKhK8bSOD1LMvICUABS8Ot1L74A7LJTF1Z8%2BXjgd2sPeqDJagO8OA1Nlz5bMRnJiofj0Lxpe%2Fz88q4NGQAACmB48uUaYXj84v81ladBbIB4m8It%2FFz7L9ezA%2BXPnwZFjnTq7MrnnAQBJmnnjMt3GdJ3upt%2BJPZ9TqJjVeICWAVrGPFg9smlgNDLtFnUYunvMAAFhLLdFw1oKdJvbrZWBcBFkR9vedrJl%2Fk4Vx78FweAbpGoCw8VO9bb47cNliBOC4mef4Sm691prFoAAKla%2BDXBHTENgAYfq21GAuymi%2FKKr6G90AFzj5oGIPYAom7dVavt%2BqVluX2ZIJjjrlhPPOt7AABkdJ0gKIgoOIDN11WgE59e99fCNetf2ZMy%2BkAHt%2BmczwHsKtbH0bm0LwDLa6oAUG7cvxe%2Bj%2F1gYlzXDKI0MXRYvPe2njvgl6eNhjAGB6BgzdHs6zwqsAYGlojxzvL2%2FPZDbgzVpyQt1iSJ%2Bzoo42AWlFRpxPiuLxUTbzk%2BT2Cs1jqgcTwcvdPLn%2B4XbQwAAMCBA7B%2FBQAo5XHUbdakdAxvGerV6pHLOBsCAEBVUbT%2BmiSUe0kjqPhyevth54t1a9aGQ7lpzWE1EIlyfN2XT%2FyLQSAKSDjz3gEfq%2F1ucgDiBPD2%2F3W%2FPXubEtDQlVF5ClLZWx8u7St0vkjSqQu0T5HoAFof0wFGGJi9rCOFRuKTg8ZJ%2B%2BRfLj9LdKQkqu9MpOm6YSGEYNUw7V7rszWGQ3GjzhJ%2Fmul13F8lMqAVJ3vmm%2BN0YCNczOKVjHLh7OR1fSQ5lujMR3LgT26stFEOa9w9AAMQ%2FeBn701uuCkL4hZSKwDS%2BePo%2B%2F0rAxy9pu5y7UsbAwAAMIBG3xz3AACg9Hj638E%2BD%2Ba20cOVPCyo%2FXcBAACg0sGtf6biJ5MOPJcSdhddv3nrMvZleKjEIr1pMq4%2B07135Otcv%2B4hXQgMoBI4%2BaJOE144lf99IgcUoQrAdn4VcgL0rtOfdyZMO7AOTiTAANgDFD1x8eP3gXd%2BAwAAPBbS%2FHXeQIb%2F759sNFKVqQoo9y31z%2Bspu3vRclAAil20xF3h1dO%2FkTGcd3UACZAz4876NHATnUH4g20Y0ne62%2F7I4vucRQePYdtV8BhhwVyzwMgCgKp58feeW4EhkCBNIsuhrjQACsHkNTiANwAAZDmvM6Xz9tOvIXvsdSdTOQsefa37gAXIYDcZ9dI6okNxR%2BmkTtnqSjlB0VKTKvUo754w0y3q4pEAJsf3DeSo6fO8hvaQQO%2FuDwBqDxBcOLe8vHzuhZdeXF5WJRQ4YixwreodAgAI%2BJgg4kBAAAF85IQIwC5f9e9uxcZzdMmufLqaKRr0twHkLk7Xfob2CLAf%2BdlNdbgE8AHQ1Fu3bWrivrumb2JUWLx%2BXng6bjk9KrHuKErXqXkQMLcoH5vAufadlD78jK31CPSY%2FUyjRJSxBlr%2FncH0w1Nkh2hj2AMpmWVmxmr7pV%2B1PvOUlKxGPEoCJL2L8Sf9oo0BAHEBOCAAdr1d9lZAOhhYkIfn%2Fw2M%2B73Bdlob2gW56WehAgBwKaeW7rgjBEpEvKLqY7bc%2BrP157Nn%2ByUEoZBYe3CJzfLpvuXr4%2BOBEBSuWtVoc%2FLf6MPAbHJpWMpAF87%2B7hwJAADUwK3n9r8GOtlbXyjkmrtfRO17QF0gINEBRPYDjABmL6eB0prdmij2qVu35O%2B2XkDKmHaiZdW4v%2B4IqYFOR4cdf60YAu41rtrug%2FQ5lP%2Fr5gbow7lcxx%2FsHeRGiPH6dOz8qHAeHv4eK42tA5Zb6MWcl9%2FudQOGjwanC0Gzvfvw%2BXY57LzcObIZbBcAAAwrfr3bmFYJXB9k9pI7XyVZV6oLMCQ6QLa2pyMxwgYMrexsAM23ray%2FXp7OHzcHPv6RJoiq2D%2F96lxV%2BQhwaQ3nD5x%2BUoFCsglR4XFRe2t5i58QwCdldANefTnmXhW18Nl1fb3UdLL9iikAAMoRPM19CPPXG76%2FJsClUJiF%2BlO0oWs97a6V6QM0QN3VA5VPEQIkw9N3WqFtaWNEAQCA2ANYccf%2Bv8%2BfrYRPmrSICrV9w0G6AnA2urV%2FBjSWU%2BR8eczYpn%2Be%2FuIAAFHHoz87AOXDf%2Bm%2Fa6h%2BuiEF4MJ2%2B7mFbBAWfmUpDL2TF63AtrQxLAAA0Kz2AgMD3t%2BfvV9eyr40rqKBou1mIYZIDWC435fhSdIfY2BKppcgm8LW1d7pkkf1CppMv1iVbmh7s74EAEAAXFe7rTtapFzKBPdYRfO%2BiO6rg1msgSvBNZlOH2DqdFb0tFOTV2Ab2gNAx0%2B7CzCBsXY7QM7wPVx%2F3X1wlrktq0C0qD7g4VFwAgAAALB84CJhpPP25L%2FTSLkr5beIBTHnPN4ePS2SK0q3TwMwAGJAf%2FylXFJWOiAIGOORl9p3Om5%2Fdez1nnnVqeIDWKugYwTga4ByEAq4xvDaHGwPPzEJQMDYE2b57seMl1btSOi126oAkvXw%2BLJEwAvY8frxI%2F8Cu2ltFoeyQD6WQ7pZqa3hDi%2B505k1eg3c9BkgAZJh%2BL7uZnWhoaSSdjuBMd53Wk9a%2FuV1H7yDOua5BtWIxGavDFIAimach%2BmTfSbJFDs%2B9NlRuHjShtF668uoRa9MAE1%2FvYEkIT%2FnD%2B9y6wEQQAM2cLioezR1y%2FsNRqAFIZIgV%2FDephjfu5%2B9AYAQay%2F%2BehZf%2B55MRk43vnhX2wP%2BZ9pPmuXL933wqn0EtFsFuRskJlvTwUzlQOPI%2FfkD%2F%2B%2F9FOC%2B%2BHPYWSiAUgBAxjVezkv8LDk%2FGUQcSM60xgqgZ5rv9z9RJQOABAxCjo6NoQytcBGB3t14qtSK6IApAtx2t9LpcBZrp00NqOuOZqBSBx5Yuq5%2BNwjOWXTQnJmbq%2BCSEQ6GtQfKeikOVDDi8fD8XkOEmE8Cv3TyHQE8CKXfqxJEgVKAWjquD7MwjJUj2%2FgdJfqBmHTF8RKggic%2FK75VkSRRT1YqE8yhrj%2FlQMcC7NHPv%2FmcSAlTQMojJ%2FPYAd5nOq58F%2BTlnEQH9MGxA4pVsL%2BQ2FCWU0B5sxhNT3%2BCnXIFcA1ao0e%2FfXlFsO5rK7egyb0z9%2FQOPWqe6fc0IAKg4AtgQWPluX9kqU7DzGQAiEGDF3qxcsTfaN%2FFFAAA%2B%2FBdOja7kA6rJQWg47MH3oc6Tb8DXs%2BZV52H8gFYA5CYr%2BmgMgU4BOH3PT5cVClAOXL4WsHkiaKGemsptRBAFG4dp0N%2FhgUAqQfHCGA5fWEjvaUMADw6iE9%2BbHztSYYi3bsEu4v2JE8R4QBqoHL%2FlapidxCtkTp48F5lwwXeV9pNm%2BXb9Z5FB%2FiFWFuDKyQ2e5oQAFCX%2F2b18YUF0GYUUhGIlo%2Fq47QYF5M47gB0ST8Aou5r%2B8jfjwIDAKwOQN39PZbvq%2Bvwy5OxywWhxQfYv%2BmWK9Rv8xw9SEDLiBO2%2FvJf2HdRAEh4ds91D95n2q02%2FdXLM4sOQq62Bn8KGCBbA5DMPAKo%2B8TD9XfsPo2A5KHxaratRAUcBjElPQcANAKAaw51l5fM%2FruFR3%2FKnN0cdQJdWY8VMAECojrqkeUD3t0Xq0U%2B%2FtcYANgNxBNcZ3vleTcLsICuoVrGtq0BHojaT34BXp5DdBBV2HYNDCMsmGXFJABgsXWf0GF71wSLUnNcCg4fTEtLAQAAOE9P%2BK%2FsV1FMytUvWgD2G6DnaQDMwUqtrrrc28rn0Ob%2FRh0IVE9JrPFPYViJ%2FMYW7aQapUbjPq4V0eo0CTD0Q2UIHmg6b%2F0U5OWeJYe0Sg%2FAGqxhBDD00mSA4jmYLv0kNOICADLn0b%2Fv%2FJCwABe5WvqOs32jIAyr1Pd8iFhVNJDOPCwB5wFAba8qfchRxtQXv1CfTrA2oDtaKVOQECp7tDoQnDMj7lEf5QG7nQYAPICZ0L3aT2dnUwAAgIsAAAAAAAAxNwAAAwAAAE2oTR4ocHdocXNvbnFwcG5ubmpibGpgamRpZmNoY2RoZWZgYWRhX2hhZmZkaf6HOm391ODlmXhVXoBt13A6IwBrVREJCgA6PSb%2Fdwz3Ugwrx5oUJG1MtACgJBwVfT3JTi7IlO5DhkwBKEgOiNCvkXjoUMDABT3i%2Fevwi3UmAAAnClIB%2B6Lt1PdvOfUX2cUFJlaTq9b2LZcO%2BDZTe3%2F%2BZ9pNW%2FLq655Fh1T0AliDa4cRwOy1lAEEjWnq1O3aRkoBQNlqRp7%2Fu9IB1JAaSfDuEUAISJBd6NiYKhuoBOncXLFWwx8JoF7PW5oZHVeu%2FiyNQZKgq%2BcbmzZouckNNjtXkDTko%2FP666C8dThHHhIJkoO17A%2F%2BLd5n2k2b%2Fhq6r6JPtS5ouwZfjAC8k%2BQkAEBA1OPwa69AsTt%2FXHqoKnAYYCdQJeLvp3OirV7EWtlYADQUPOAA%2F%2B3FoHfovDj%2F6QFY26iVorRTbtxKe1V21BIA8lmf9Uw6L0bmwMK3K%2F4B%2Fme6bn9173ofkqqrsLmGLpGYrwEqmRUAbs7r%2FdmTHUt2fHX88uQAKBRAFntQKBerxi7QwLTVeNIDSEB%2FNc%2BCspZcLzLWG4kAEnjb6nvde5vZe5IpWnqRpovZCeNLXANOqGnl1S1o2ixKRQ9AWaY0NwP%2BV9qvNP3b9TPxDuEjvIFiDS8YYcGwBiiHgNJAjF4ewt6sDABQ83C6eb49cV1aAOdsRKPdBoAKcmt03RgFIDDk08hWWjfhRaHNHGPsAGDoDCfZ1FKSCMI4uAQSUVvVr8kCEAFqzif7C7OhmylYdGkt7bMC%2Fmc6bf0U5PuZRKdTB7Vdg08k5muAWj0pAJKD3Nl4l10miK1HUsd6AQAAwBbK6KeJn6%2BlzmSM%2F%2FwAIgCSW56ewGYpfF99lmEAkKCB3PVv4Wq%2FiNCOXWpsFwTMN0ob2QCAtFi2frssZC5VDspxr%2FI4%2Flc6b3935Gt33kFzJm67CqKZETrMVpVBqgAQe8u%2Ft99ucRRTr0yZ7dZmAACAlpJdjpYs6LmCjv%2FWWgidGABHgmMBxcp7V%2Fk2zv3t5%2BcmAFAArVm56lKNSH6YqXxHYAKZAQbzbUXjiYeCVauN3AMeaDpvNe3LyxNFh%2BdM3G4N2t9%2BRgBDr3ABoAjj6%2F7cfredQG60JYtb6xMUAABsCmqJumYdIURs5ekxTLn3gwWKDgoLJzoIDgh5mkwzxowbnY5daWi6FKkYpNdHIjmsHLwOL2ADhSOb981iERrw4GyeDh5Iuq407dXXcxEdYl3QXIOHxLwnBgNwkXD1oS8mfg0EduDe%2F552Ls2ZxmL174OwRNMSpAe9CmAav%2FnaInNSJADKJhh68fiG557%2Fm1FhQEsNVtHyarT%2BtLJrTmCBYgjbDDrHPkNsUoKOJju4KGkpxwDeNzqu1O3V92fiHeZD3HYN2geJzW5NBaAap83JS7%2BfT2wDgBqDROn%2BijsM3Ojv506howX0hicx8ahm4F%2F7er%2BICAmAB0Qi863vsx%2F2%2BK4f9kCzW4NSKvfn4%2FxairORUkM5upeeZkevOwEUQPCf%2FtAA3je6bn8W8Hp3UdN7CDfXQCGxoQ8mgAyDeXx5z%2F%2BH7okc1EPhPn5cZnUV1COVysDQsOBjFvYWxpR9CIPvFwSAAL46rDjG6n7YtOUcv32S5wRwWHk2tg%2BxQ9hs32MSYJJevIveFb5msSAp%2BJIlfwD%2BV7rd%2FnTk9Z4k1amC5ipomYwQMNcAOTiAS2m%2FlGJ74IUWQHjLjJb901sBQPScfiL2YQcAIDrq6Dhcq8f5vyL9ZULZer99n%2BAA4KiRPcqgOsLJhBeZYHveS%2FZ6ItRE57z4%2FiOKy%2FxhOwjHrF%2FVDt5Xuj1U5Levd%2BRVrcu1NcjOCGBYA1RMARSkm4c777qV7KCu0U8m3PavVQDw%2BFn6iQAFUACtVyZX9CSf89EOhaGWQpMAGqBgEwAfTlhf1gSi%2BHFJIuQGHknwq7QCHWLP%2F5NTg2TaDDNoBNq%2BKMUV%2Fle63%2F50FJxdcsjqoLar4DACmL2SBQAoIbnIdqIGIOrhMg7atwQAAGiyZlEuPncHhaWffPAVp6zJmacBf51tA3G4cWs9GLZ4bcBCekILSd%2B0QBI7aLBTYHaEztlmC8ac0V0epDg8RzIdSN5nut0u8jt0V95BWwrpKjhMvgbowQAABryfOx0TGno9G%2F2NBQCFpuUVy31Yx23VlXKHYxNIQHR9a%2FjfLw4JJA9Y3u4dkPx1d7FuDnXr%2FR4NG0Dn%2FOpeL%2Blt7Q6gAZQq8ycM%2Fje6XSnLl69zEh3UF2JzDWCEh7lGQskFALg2H%2FzAawJEfGqGT0KfBQ7QQPhkwj4AAAFxWcd5xqvqPPZunlrBuIsPBaAE0dA4AM3JvChlqZgMERlLXV3NSmx1lw6QvFP5exMyaa9SqXF1EiXr%2Fle6W%2F105OWZRAf5StRcgxYEIywYussCAF9O1%2FjuC4M2XKI5OhoEuuYoAABZvHwergyVm%2F%2FhKT8DQWWA1C10OA4AwDho3ZVKNIw%2F1BVOzgHQ0OR5slDJkMe%2FAtSTvu%2B%2BteenOgIUGHonAd5Hutwuy1f%2BrLxD1txcBSuQmT2LAQCiGid8uQDA0Yp7jH22e4t8FXfpgd3eYp8eT78FNI5ul27z8rw7lL82VLgcbk4QGkGpPXuvsrOYj5fdEABww2B32RYOBxZK%2B5yVAv4nutsq8yX0dNGRty5oWQWPEQa8uywAwPG0ZbNrFrgG0%2BnET2tUAIC%2BNTzq24%2FxGyuEIKRiPjVBnyorGiNOQLltxy9dhZ69%2FZYNlrAqqcg5BXVV3n5cb0UD2PGDbeSuJ%2FWUC6%2BgYPzz6%2Bn%2BV7rf%2Bkzw%2BkTJQdbo5CqwkNgMxwWA9srW%2FzYjXe5YzDe8dl3gwhxjCp9R4avRewHlcg%2B3y1U6AUgnQgkCIR3Hz52z7u%2By18rsaqcAeW0rXDfaJUEgUW%2Fk0oZoX40WQfaqdkwC3le6nJb56usdeUeiFeYqWJDYUJZZAAiB7qae%2F%2FhRM9bq49Z5x%2FYkHPcsKTgPK3MLjwJpwXNnS8QLAgBwAsA431eFbTOc%2FUMwePA1D7UYduuBHUTXVIb7BdCdc90xzYWLNCfVE8Y9WVcH%2Fje6Xy3La%2BjskiP3YEmugm9GYhLpJRMAUJX54gsrcM61Xb7%2B5Yl000x8YcDAaamOYR%2BL3CehAIARPPMPd8GPNPDuUoXKBER%2FgapxYx%2BNWFBvjwb0bua5OZFkHAFUOv3jw3pFy1UA%2Fje6m5TlJbi76EgPqLkKbiGx2R2XACiuiz2rHAiAJO08z%2BGpsi81przdqLGs9NQfCi5De%2BT7GghQOBAAtkVdj551z3rkyfkdYIEmaxctq%2FzvP8P5A9b%2B%2B2Q%2BtyClWYKbaGMA%2Fke675fly%2BvdRYfMlaS6BgsjgNkHEwBSsBL%2B7345AyJqVvwWFQAAMBZovviMNLVWiGUUCUA4%2F3rQVS124jXqoI867eushzly%2BtmJCDgwKe5d3tA22LH7CfDw7s5lxWIogEkPidVWqT7eR3puvSX4PiOvOmdTdRXACMDWAF0CAPLi%2FtmBv%2FeawGBRi2Clv2hWwNNO%2BSI1AAAKwG8Zr0pdh%2F9Ne72KZWIgUixwDhBANjYyLQ%2BKQ1TPDHZTKswWARm8N7h%2BSnGgiALteAUeSHpXPgtyvaPcQT2LJFfBJRKbvZQAgJhuH5zs6QBCWLzk87%2FQ6bfH%2FXSyAwAccMbFPMmLZMYOAOBBAtHvDpWvzcIo%2Faker6GpOkBzE5Eh192vE1afArB8Mpx8SekKFH%2BvXXsN3le66xflxddTRe13JTdXgWTyHlwCFJq3Rg7avjicFgxDsOqh8u3YqETm6jblat8loutdb4%2B%2F%2BlFxxwc40Dupk75v0XVOXfV2w%2FHbBAAueeW9RfXePbezrpNB4%2B02Ulx9coZIlysEHAA%2BOPpNPx35urvcQT0CJVfBQWKzZyYAkGAo7Yd33hmV%2FXC7F57HdN3YnlJQARCUPyOrzy1bI4YAAIGj2444YFUd5RTFq%2FP1roZFI6DPeEy7729ZDyl9WqJf7IryQAayvV6Y4x05BN5Hevaz%2FAruKmp5hVBrGAF4t0poYAjbh92mKy4OYNI0MsvndiiOlzN36Jy9KTWtr9rq1%2BOqsKCuHDio0PFf%2FVGxPgr379Jo2xDw1JxmZ0buRBhrVAcRuP4HgV3OVpzN1ALF3e0bA95Hup8U5dvXO%2FJa3lXsWQUwSaRHQgBQ%2BTHQrX8GAmDd28VgrDCdw7EMACBBX409n4uFa1WAFDcVvXdqYdj7nx%2FJi4ZAk9gevCW3X7rbfm2lAgqP%2BfdmdO5NArh112iYSt43eidvibw%2BkXcQR4B0FcA0S8cEAHB43G%2F8U5iiWHms3tfXz8exDg4toXmE3Yz5XHwY5dysA1idTApbOfZVD%2Fwnu4YmNAAkxpOXhpi962vfAZ33vaOz6IumLwSOKf3J1g7eJ3rrNwdfu%2FMO8hFwrIIfpqE7zgAAHSyWwx%2BiAFYfR%2F3gbe6Yxh5vJizUHhyFY%2Fh5W99YeQAKbw%2FkCAr1jjPWPIabfQMLEZYdUNcCsL3q014BJLZ3S7hdla7bbHJBHBmoSPUI%2Fld6nBT56vvUokN6IKiuAsE0u2MCAIJhkAMzCwAtr%2FeyMS%2BieG79lwaIAMIjIi67%2BH2D6gQLe5Cso%2BtjlY95UfkwVKg%2BE4AAs2VjLWfIm%2B5BO%2BHwb9YCbPcQgvOmQN89AT5I%2BuiXeQk9Wu5IjKoNk5fBBMAyue6nSkxemCqiKTFkA57PP99GCUes9bTeC3VnXC%2FVyNVwUEh34W5aV4lj%2FmyMAJxAwpqhW1g0PvygB2FKanx2NTWBQYU%2F7KyCreocHjj6m74Z%2BH606GiOBMk1%2BGHyXnIVAOBB%2B3B3pcDJf%2BhCD7k%2BfUjKZAaA1BM7Sue9sCddXXgSYEt5wB0qf7VKK4esHyreYGAFmtcoh%2FEEUDBxfeq1poBi3fXNbE%2FHC6TXW86TKoqbygHeR3rsZfkSOjXvyB1IchVcMQ1rgGByAAAsXw97k0byqDHWrYAA4LR848uX1GFC3mQTVIpwLIiLHPLfU3cADgBqbPXI6nnhdfq%2BwmbMsbnV%2BVlYoAf3L1qQki21QEw6dkKR3hd61lm%2B%2Bj6D6GiKMbkKHiMAX9OBYwwAlGrl1%2B8xALTgzg%2BEAHANGVzaiAIIsFqaFj8d8Yq7IDo3H4VTYCcOUJTp6e3LfKBLS38g0gJCqF3z6aCUz88GMjTytYuNVeZ5AjAmbSwZHij6KIp8Ce4qOZqHAMlV8BgBDN3KGAJAzCSOXJQGQKPriv1PCAAAvd9VZorjdbmuZ2zUKy3hD9ABFchTaziUZe%2FQ6i%2FJJsa0Rj83K5w9OgYfKPQKrcsTCkUkr4LDx7LK6h%2B8MhAA%2Fjf6qDN%2F9f3WkiM5EyVXgUZGAMMaICQAoES6bv8vAIJZ3AgC6QoEcKnN5GhGV0AdWFnPwu8b2pya0hVsp1JYB6CDADKbl1FouUIgW%2BpBQx3j4%2BIvjgIPn8aKDy6U8pLD0g9aHv43ehZFuXp5gqjznYWaawDT0IMJAJBN4gutv9sDgD3iHNnfY%2BPfkUIuvNa4AG9Agz8PXa0fCt9z0QbwJKSHyJV8LGkZN4tRdePdBBylNFwajC5Z7l80SVOw%2B4WnQdcMXS3rp8uOskIvAE9nZ1MABFm7AAAAAAAAMTcAAAQAAABbZhhZGGJhYGZlY2ZhZmRnZmNpZmVnYWRkYmJiX%2F43%2BvYyv%2Fp6K1HnG1ByFSimIRwTALC9uTbGLmgBl6%2F3Ntc4HIXx1UotEUi94tDlFoYji6%2FxqwEWAIKArFb2fj%2FuD2bpMN6Bk1d6ZXwetq%2BWY7H3XG4VoBlV73f3Phz3BcwTHkj6FoVffb%2Bj5DCF4lmDw%2BSlkwAKCGfz7sQEAMLntkxln6fiQlc5AQkCMn%2BeEzvl0UaOKyMLKFJXk47A1oeDtp5aPwJovWitUa9lQ13vo%2FGiJC0ZiN%2B3n%2FsWhx2nUQjrAd5Heqssr8EH0ZEcDclVABLzbmUOAKgjw9vsAoC%2BLf1ZlQq%2BbbZhJSCMvhm%2BmqRBkX98cgYAMhsItnnuiuYfhuGXQ6veBY2Ais6FQ6haLTikGk4zdeEzEeQay9wcLcfRHP43%2BtaZX13fWtT9RpSu",
	info: "data:video/ogg;base64,T2dnUwACAAAAAAAAAAAvRAAAAAAAAG3XaiwBHgF2b3JiaXMAAAAAAcBdAAAAAAAAN7AAAAAAAACpAU9nZ1MAAAAAAAAAAAAAL0QAAAEAAABOZpY0Dj3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FFA3ZvcmJpcy0AAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDEwMTEwMSAoU2NoYXVmZW51Z2dldCkAAAAAAQV2b3JiaXMiQkNWAQBAAAAYQhAqBa1jjjrIFSGMGaKgQsopxx1C0CGjJEOIOsY1xxhjR7lkikLJgdCQVQAAQAAApBxXUHJJLeecc6MYV8xx6CDnnHPlIGfMcQkl55xzjjnnknKOMeecc6MYVw5yKS3nnHOBFEeKcacY55xzpBxHinGoGOecc20xt5JyzjnnnHPmIIdScq4155xzpBhnDnILJeecc8YgZ8xx6yDnnHOMNbfUcs4555xzzjnnnHPOOeecc4wx55xzzjnnnHNuMecWc64555xzzjnnHHPOOeeccyA0ZBUAkAAAoKEoiuIoDhAasgoAyAAAEEBxFEeRFEuxHMvRJA0IDVkFAAABAAgAAKBIhqRIiqVYjmZpniZ6oiiaoiqrsmnKsizLsuu6LhAasgoASAAAUFEUxXAUBwgNWQUAZAAACGAoiqM4juRYkqVZngeEhqwCAIAAAAQAAFAMR7EUTfEkz%2FI8z%2FM8z%2FM8z%2FM8z%2FM8z%2FM8z%2FM8DQgNWQUAIAAAAIIoZBgDQkNWAQBAAAAIIRoZQ51SElwKFkIcEUMdQs5DqaWD4CmFJWPSU6xBCCF87z333nvvgdCQVQAAEAAAYRQ4iIHHJAghhGIUJ0RxpiAIIYTlJFjKeegkCN2DEEK4nHvLuffeeyA0ZBUAAAgAwCCEEEIIIYQQQggppJRSSCmmmGKKKcccc8wxxyCDDDLooJNOOsmkkk46yiSjjlJrKbUUU0yx5RZjrbXWnHOvQSljjDHGGGOMMcYYY4wxxhgjCA1ZBQCAAAAQBhlkkEEIIYQUUkgppphyzDHHHANCQ1YBAIAAAAIAAAAcRVIkR3IkR5IkyZIsSZM8y7M8y7M8TdRETRVV1VVt1%2FZtX%2FZt39Vl3%2FZl29VlXZZl3bVtXdZdXdd1Xdd1Xdd1Xdd1Xdd1XdeB0JBVAIAEAICO5DiO5DiO5EiOpEgKEBqyCgCQAQAQAICjOIrjSI7kWI4lWZImaZZneZaneZqoiR4QGrIKAAAEABAAAAAAAICiKIqjOI4kWZamaZ6neqIomqqqiqapqqpqmqZpmqZpmqZpmqZpmqZpmqZpmqZpmqZpmqZpmqZpmqZpAqEhqwAACQAAHcdxHEdxHMdxJEeSJCA0ZBUAIAMAIAAAQ1EcRXIsx5I0S7M8y9NEz%2FRcUTZ1U1dtIDRkFQAACAAgAAAAAAAAx3M8x3M8yZM8y3M8x5M8SdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TQNCQ1YCAGQAABCTkEpOsVdGKcYktF4qpBST1HuomGJMOu2pQgYpB7mHSiGloNPeMqWQUgx7p5hCyBjqoYOQMYWw19pzz733HggNWREARAEAAMYgxhBjyDEmJYMSMcckZFIi55yUTkompaRWWsykhJhKi5FzTkonJZNSWgupZZJKayWmAgAAAhwAAAIshEJDVgQAUQAAiDFIKaQUUkoxp5hDSinHlGNIKeWcck45x5h0ECrnGHQOSqSUco45p5xzEjIHlXMOQiadAACAAAcAgAALodCQFQFAnAAAgJBzijEIEWMQQgkphVBSqpyT0kFJqYOSUkmpxZJSjJVzUjoJKXUSUiopxVhSii2kVGNpLdfSUo0txpxbjL2GlGItqdVaWqu5xVhzizX3yDlKnZTWOimtpdZqTa3V2klpLaTWYmktxtZizSnGnDMprYWWYiupxdhiyzW1mHNpLdcUY88pxp5rrLnHnIMwrdWcWss5xZh7zLHnmHMPknOUOimtdVJaS63VmlqrNZPSWmmtxpBaiy3GnFuLMWdSWiypxVhaijHFmHOLLdfQWq4pxpxTiznHWoOSsfZeWqs5xZh7iq3nmHMwNseeO0q5ltZ6Lq31XnMuQtbci2gt59RqDyrGnnPOwdjcgxCt5Zxq7D3F2HvuORjbc%2FCt1uBbzUXInIPQufimezBG1dqDzLUImXMQOugidPDJeJRqLq3lXFrrPdYafM05CNFa7inG3lOLvdeem7C9ByFayz3F2IOKMfiaczA652JUrcHHnIOQtRahey9K5yCUqrUHmWtQMtcidPDF6KCLLwAAYMABACDAhDJQaMiKACBOAIBByDmlGIRKKQihhJRCKClVjEnImIOSMSellFJaCCW1ijEImWNSMsekhBJaKiW0EkppqZTSWiiltZZajCm1FkMpqYVSWiultJZaqjG1VmPEmJTMOSmZY1JKKa2VUlqrHJOSMSipg5BKKSnFUlKLlXNSMuiodBBKKqnEVFJpraTSUimlxZJSbCnFVFuLtYZSWiypxFZSajG1VFuLMdeIMSkZc1Iy56SUUlIrpbSWOSelg45K5qCkklJrpaQUM%2BakdA5KyiCjUlKKLaUSUyiltZJSbKWk1lqMtabUWi0ltVZSarGUEluLMdcWS02dlNZKKjGGUlprMeaaWosxlBJbKSnGkkpsrcWaW2w5hlJaLKnEVkpqsdWWY2ux5tRSjSm1mltsucaUU4%2B19pxaqzW1VGNrseZYW2%2B11pw7Ka2FUlorJcWYWouxxVhzKCW2klJspaQYW2y5thZjD6G0WEpqsaQSY2sx5hhbjqm1WltsuabUYq219hxbbj2lFmuLsebSUo01195jTTkVAAAw4AAAEGBCGSg0ZCUAEAUAABjDGGMQGqWcc05Kg5RzzknJnIMQQkqZcxBCSClzTkJKLWXOQUiptVBKSq3FFkpJqbUWCwAAKHAAAAiwQVNicYBCQ1YCAFEAAIgxSjEGoTFGKecgNMYoxRiESinGnJNQKcWYc1Ayx5yDUErmnHMQSgkhlFJKSiGEUkpJqQAAgAIHAIAAGzQlFgcoNGRFABAFAAAYY5wzziEKnaXOUiSpo9ZRayilGkuMncZWe%2Bu50xp7bbk3lEqNqdaOa8u51d5pTT23HAsAADtwAAA7sBAKDVkJAOQBABDGKMWYc84ZhRhzzjnnDFKMOeecc4ox55yDEELFmHPOQQghc845CKGEkjnnHIQQSuicg1BKKaV0zkEIoZRSOucghFJKKZ1zEEoppZQCAIAKHAAAAmwU2ZxgJKjQkJUAQB4AAGAMQs5Jaa1hzDkILdXYMMYclJRii5yDkFKLuUbMQUgpxqA7KCm1GGzwnYSUWos5B5NSizXn3oNIqbWag8491VZzz733nGKsNefecy8AAHfBAQDswEaRzQlGggoNWQkA5AEAEAgpxZhzzhmlGHPMOeeMUowx5pxzijHGnHPOQcUYY845ByFjzDnnIISQMeaccxBC6JxzDkIIIXTOOQchhBA656CDEEIInXMQQgghhAIAgAocAAACbBTZnGAkqNCQlQBAOAAAACGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBC6JxzzjnnnHPOOeecc84555xzzjknAMi3wgHA%2F8HGGVaSzgpHgwsNWQkAhAMAAApBKKViEEopJZJOOimdk1BKKZGDUkrppJRSSgmllFJKCKWUUkoIHZRSQimllFJKKaWUUkoppZRSOimllFJKKaWUyjkppZNSSimlRM5JKSGUUkoppYRSSimllFJKKaWUUkoppZRSSimlhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEAgC4GxwAIBJsnGEl6axwNLjQkJUAQEgAAKAUc45KCCmUkFKomKKOQikppFJKChFjzknqHIVQUiipg8o5CKWklEIqIXXOQQclhZBSCSGVjjroKJRQUiollNI5KKWEFEpKKZWQQkipdJRSKCWVlEIqIZVSSkgllRBKCp2kVEoKqaRUUgiddJBCJyWkkkoKqZOUUiolpZRKSiV0UkIqKaUQQkqplBBKSCmlTlJJqaQUQighhZRSSiWlkkpKIZVUQgmlpJRSKKGkVFJKKaWSUikAAODAAQAgwAg6yaiyCBtNuPAAFBqyEgAgAwBAlHTWaadJIggxRZknDSnGILWkLMMQU5KJ8RRjjDkoRkMOMeSUGBdKCKGDYjwmlUPKUFG5t9Q5BcUWY3zvsRcBAAAIAgAEhAQAGCAomAEABgcIIwcCHQEEDm0AgIEImQkMCqHBQSYAPEBESAUAiQmK0oUuCCGCdBFk8cCFEzeeuOGEDm0QAAAAAAAQAPABAJBQABER0cxVWFxgZGhscHR4fICEBAAAAAAACAB8AAAkIkBERDRzFRYXGBkaGxwdHh8gIQEAAAAAAAAAAEBAQAAAAAAAIAAAAEBAT2dnUwAAgEcAAAAAAAAvRAAAAgAAAOIizV8qAQEBdHFogXZNUmx9dXVlc39ud3Vue3FwZmheYGNiYGhoZGltamRsaGNgAAoG7KjTm8ym12fC0g0OYBtQma%2FeJtldtOfPzWliQmvkZOdx17I9%2BV%2B9y%2FZoO6EZPKrv7Bu5OIFa9Ufrcb2Yl%2Bw2lphwrnk%2BakRpBfcoXOc8b2HF0GCWXK7bfLVc4HFyT6N5PnSL30aO7SHA22UDCEiovPN%2FKwAcydBg9zrYB8ABsN8MB1gAZwGAWLywtQiZbbf9d5uRuLQ9B5qO82aOC61z%2FB0XNI%2FdwYCxf1fbg95oGvVAFn%2Fvu%2FhSHBnJrUULDwVFcRazFo3x34ccAEXjASME%2FE782rHUPkcCCUoJgiCARosG6ublBSRHXry08FvgWwWAjvbGAtBPAAf4ANwvALjp3%2F2BkCNtQyIjAOA2Xo5a%2BYWR%2BJgPZ0sb5ubYCpqKWilCJ7oVQSm87o7MWCb7XJK2RlViDewB3FahwohcsXOaElUBHCoL%2FawK%2BZMrvzcA%2BnhcHX0uH16JGXtvF%2F6A4wAADxiAjQd7AGiEBxzAXAVYgMIgvv3z3ziq4Sn4sFkaBAAAAAAAlJ3UjR0AUMkxuQsIAGpDRQCZgEQAJh0pm37XEADArQqwiBEoUaAg%2F0D1%2FhYGAADfLAkA8EKEOqu%2BPgAog6wQAFQE2EoE%2Bht4dyYBFjlc2cTLm08hpri%2BexbYD%2BABA4aNB7sCwGvDBvjZWIBBPQxuSzAyCEotlh9UAAAAAAcUsJNyAwCYI1cBAEBdWysDYCsAgBF%2F%2BeCYAwDgvRXAb%2BFX7QoAfMgwo0oZwM78JMwaTmiAHQHoOwKeMT29AALAXz5YABTFpcLdyB%2Bw%2F0sAOLS3CYAzAGla%2FYwLgyPfLgAAsJAkYF76C6gdUaaTHGYABNav3hcgKZeIIq5zs0xaYD9FqCj8LPivBACoeMCfsFUAHMOlw336fIBzI4AFtLcJgAtAmsr65JGE7SaM4yROaQAjfhHUYs%2BL5UG9JdJszqM1SiFEEJ00MzJPVOIIG4IT%2FWsCwD2xA77SPyQA7r%2Bi%2FYetDBzJPQCHfgGOGrHpLGwCiAGYJmsHghfpHl3rhZUqoq7%2BvFp%2BrmMrvZ1oN5VwGbFVxoX7ZiT8aPTj3XHcEsI6kCjQEL55mVYdOe%2BjjpqGQ3LpNt4AlfVPEuJX%2Bfmmx7CUVVAWgDlJucahLGiRAFpZ7CfZJfpHiVpRB3fBAxfAa%2BMALGyDUQA0aZrgxA%2BTOs1Rniaqx%2BqpZgDQPf7pBQAAKGhMOyima1NRABwBoByA6aYVGxPMxwmYpSsVk%2FcJNWDifo3PKLVepV%2BsOl7qjy0ejowXBTVMYf9Idm%2FZrxGAR5DwEaAVVVWA%2FnsuXjmcjJ2v4F0t8vnnmsfyrMCzACwscACdRCsA4JhGCvQtGdkTo771AIdWAKCOdwIAAMKrAgjAoA0AmDMAONCvo472AEAIwOCzAsDG%2FldCF34t4%2BmNhITkxcJQtr7G0YFbL2BhN3AC88A9EV8BZAG6mPuvAAYANtmbdvXv6F1JRi2gR8wugGABbMEBWHhwAH0BNGmk4ETNE2PDQ6qg%2BWckASA58REAAABUfQuATFooALgDGQA2a5t6tAUAAEC%2BZxB6GikAOn8n9XsmNhBA%2F1gBW7PPiR2AaCj4g1PoA%2FdE%2FCPAXBEBFXP%2FsggIHMEc%2F8oeviSIRihOLTYA6ADWAODmIdWCx1MeHI%2BkBfkIa2V7uqpxZ82kIKhzqx4EweXBX6WNBmJV3zGEZrlFEATQjLkYZrN8tnx1pzQo5NGsswXIblGixigSzN%2BhHIEqnlj7g6kcxxwtx%2F1I%2BJaY6AXgAAq0mgvwAua4D9BVLi5rQ2fCCzYQl7t9OBxt5cpT6SeGw03O7%2Bm8fBPD4Q8hn087PkxouVgNgrnZ%2FGlJOP50zKxpHw5VIE8TCB0hZPij%2FVyw48aR3W2f3ZL3Haraf2V2d1QPitQdmjmsUPES7GHRlzXR9gc3vS8AXwCQHB3oxp0A8uhdKQDAcHj7Uts68K%2FaygIAxON%2FSwLgSgDVJoADOtoY2wI1L%2FV4zjQyjMDugSen9AAFFECe9u1fLV0eC%2FCKQGIDgTKhMdR%2FlMRWcJMGYMAXWPAfaLydA4%2B%2BJgjvmQLpB7kUNb75m7r2i9gjY57ugMLD5U5%2BAAf8AoAYM4wCMKu7CwDgfkn1HADRDrydXVDwH04VAID3ZQUAPAMWAACmVt6K0lvLBQAAYJNevXTnRFnghD5Itl7N%2Bc9zvkzeH9EAuOPpQD%2FAPjlcaWr2QNuLUwIAVonrk85rtIZEVnZn2u%2BB3OsLwC8AUGY2CqAAINb1CgC%2BsTflCHpJtiIAQB0%2FUwDArQo2AAC4bfAsijStzikFAAAOocnMAiioAuph6%2FVJnsSuE3iSANBwBjcd9lGFsFd8sRx%2F9C52HgCgxmNgjA0%2BA19qZl7dCwQkycS%2Bxee3AEcV8rIVBRx0AJvN0KaFQHPX3sfdmjC1tXLyanqb2ujW2pO78nLLB1l9ZERmcQkGn7188fScOQj9daHl0piMyOL5Xf981mp08NkLnycsWh5U48HsfJUoriD%2B%2F%2F9LNgNnAYZuDQIz6tZxsH2IswEczz0Ky0w7e4Av2JzAFABoD4UBwB5BG8DxTQD%2FKwEAl%2BCdntrtFBzduKblqHxVAFQnlzVIQCKVKXNGpR%2FfTe6bqcfvUOhL6cbKXTUXchUitPL1WGAzAhm5lft1UU0AASAAj48dCoAqeEw44T1BB1qJLJzfpdO7JFt0de8CQAbAJh8bXLAcYAFt8L5%2BwBoS807zkxACCs0Q3Te6AoSEbvjO632zkgFguP13WgD%2F07LGRcaBAp8CAAzXPx4Ebl5OCwAAAODAtUUpAOCFV%2BID50a%2FHgeK2IIQ5XrPw9ZGKJKgd8%2BfeBcAnAcABz5pnI7VuWKUmNHd7ALAA7BobXDJ%2FAUAQ%2FT1AqxCgtxfdUWclscwkCdDAICjBmI%2FAgCu%2FyjA9opCDQEML%2FJkAIB5TfuVC%2FqFAgAAOABAoAAAjOwG%2BErcQQzec38UQSTRa2styc4ZTNEsHqqUhgGARioAPnmcLO2XTo8SKQJO35OgJ8Qi0QFQQfoLABbpKgL6KiRg6m8GMuZ4BjAtAADfYdGvAgDA1VMBjncCpAEv1KcJAAB0WM4EZwj8TOxnCgCggO8JigMAfXESVXLoP7kog1oLdu7qofkIH7B00b0UACBVAf5onI7t106NEnIhXxy7AHABCGINnxQAHgAUasQqHoDjuhx7Y6mR6FDtOgAAIoWYKgBAf1kBFL71KgIAME0BAEDBJQMA%2BE7YUAAceBsHBwD%2BqBPlqJsf3xJsAPe78JeqBHgJ4BRJAx5J7M9dL5VuGa5CPpWfAfsBsdbwSAsA5hoJfBUPIPFteSpNrhaAfuoGAHhtFzUNAKDmywA4AIBPthsCDjCHSogFDgDwGkAEAA7eE2U18cuqIQLgPw47qdPQupIFXsnU7NgC3j0kCQop%2FmjsbzrXKqRHppW9B3g4fQ0fpAsYeCMaUPNdJ4capi%2FHqRfbAQC%2Bl5AnJgDA1agApAEAytsOC4CH9ygHfqHUAZBvpwAKdFSNvV81Wi8lI%2FH304yx8GoEs2YBwKcaAN4onO7aL1UsFu5CTuuyDWdnFQQLQJobsQrgk5MBAL7Xoj8CAHBoZwCAdEm0COBUAQDMdlAA2NGM9%2BAuAF5QhN2VjhHUpUUA73l6kSGnZmQmZbhSrkcgbuRg4e1qBDMVAL7Ymy6daxWbh6eAk1l2QO6tgqAAUABFugrQVwHiXykAAJs2lXADAHC1IgDAy%2FVoAACCAwD4PQoA4N0AAAAAYgcA4P6Qt%2Fl3HDdrgfcgIdUE%2F8dFBSnbhIj9gGYH9QlAgDyDAv6468%2Ftx0S3jEkBH1oP8CBvDRcUAGb2RwPg49n%2BEyshUBOop20AABhKdwAAeF0QAODHzAIAIIDOTBDNToAd9dAKAJ6UJipLdSskZcSUUyU6Fd970KMfCxywYbYpAovzaEgA%2Fnir065rF9aIcu679j0hfxUO6QKGtI8G5%2BwAAL5T1M83AIBzDoAGAKA%2B4UQAsOz8vVqWN1NiJAg2eA0PAWArAtyv0VmRzhmyuPidtKV7E7pCAwDW8dyABAn6FQF4TRoA%2Fojrta5rpVeJSkS8HrxbhUvSBx1Q5Dy6XzkAwGuYunIAwI%2FLCjAPAQEIusFbowBQyN1RKOBetc9sp9uAnwTRVfCzdAsg29J1bL%2FACCb9XFX0nn35gBn5G1%2BFZNmGXjYYEXTiNR4agAL%2BeKuGntdJaBnpaLnnwIL3qyBJJ8l%2BABqAh772TRmJhwCssQMAuBrD%2F2QAAGwV4PhSIyIAIQD4CZLuQvU%2BSgBbIYTA%2BQFZADBqBfBDZooDgf0vAHsZwHVVdgZw%2FgwUe70FKQC7%2BJ0CAN4Y63VdL50eHlnklgduFT6ZDwCG2aNXWwsA4N6OOhABgHrtFcDbBABikKpCuAVkHK%2FXdAboHjs%2FPe4i6gB8YKFxdR8XAZSDTRiWgP0kC8YbqAYAWF81dmZwymwsSQJ%2BJwCF3ATeGOsP7ddKD6IKvB6wvwqPdJr9dED3F%2B0BAMoOTacBgGIvAM1abwgUvAVQsHqVva4vAeAkSk18FS%2BLgPSasNZe74hyGcBfdkbYQGeW4KIITT8F9GNH7aEGL4hecNz%2FZhNADiFeTQMK8QC%2B2OoPXdcuNItMGpYDsb2GD%2FKDDihmY%2FQ%2BNQEAoLeXfBgGAMr3E4DtFoADubuodoeqxov%2BflS8YO%2BzVI92cXQdACwk4prw8b4T0XJVyIAuk43%2BDRa3dcKWNQu%2FVq8EVSD8jMgTQSzH79kACxMknsjqD63rRDeiirz2D6xV%2BCCdI2bX1DYAgKs16MIAALgKCQCA%2BhueBm9HXhSBkCjjkD9LF2UIwrkSuqlPMo%2BRAks7hp8XbfDVCPQm0c4wUE%2FOGDcP8HSvUSvbxNYg5b6xQGJovAos6IqMDn4Y66Wda6d2RhV43YPTV0GQzrT3Xi%2FbAwB8z8hBEwCANgMA1ONJ%2Fw2eBjATBctJtd8JoH8BJox3G8YBsU%2BLh5WDhpoVDrD%2FFhoVa%2BB9jp3RCXThPHolQzcl2Gpl%2BICFy1EAKAB%2BuJqYzrWSe8QUFzivB%2ByswgXpAUj7Aei%2BEwEArrrR7wAA4PtEAObJCghAGKGFfYIrgAMA3AiOLJLmBN4UZwyLeDe8BYAqgPMNx%2BrMqHxSc4TTQJtFLPZaZ8KpjQaAb718s0Cgg1QBoJTSlA5%2B6OqF9pdO9ohKJJcFcm8VDulIEyM0yQ4AwC0qow0A4HUEgP49L%2FfpxXpMgHfEgL%2BmMQD3pwBiPMgAI654WtEUDQ3g1wTsk4h%2BV9QgvwwUDClj7PbiS8RidHBZe2P4IFrwPviF1N%2BIBp7I6ruel4hzxCRvmuVB7qzhkvQApHEAek0bAIBjiupYAAD4caoAwToAAIGqyAERpaAUAPTr78M98hYAnXdiSK1XCwCJBr8WvoXrgaGhBS4DoDR0VOkAdIlXWgACenQarPoIC14I6yWdl4o9YpKvee07vF%2BDxFxAwf2%2BCsBdqQAAr0OCiwoAYGhrAigAAN9GEAEAKHsAAMCkI%2BflkXqOAAA6myGqe3wXFAC8nWITMY6s0Pu9om4LZnZm4nmw12cNNgBVAE9nZ1MAAICjAAAAAAAAL0QAAAMAAABXsQSSLlpcXmFrZGRlY19gYVhgWF1iXV1VXVdbWl5SVFRPVFxUUlpVWFJbU1VWVVVZU1IeKJuU9WvEOqMXfd8sB9wqSPhZgFRrgIbvDQEAfCfRjDsAwPe4AjQpAAClUIhdAQACQNp7VVzrmS3ACcXyFa9PgAY4%2Fm%2BrIkV6yqCxsPFJgDpRCgCHBgD3igDeJ1tJ6i%2BanGf04llveRC%2Fhk%2FSmRUN7uoAAJhtYc4AAP2dCpD899tb3FIHACO6hJlz6GL%2BHQDu1yCwzTaAfV%2FFO3KEetTTPo1BhyUMZ3D%2FHMD6r2wHJTQA%2BBpJAP4HmyT1F82eM3oJPOstD%2BLW8IjvAFCYfm9USicAQN8pTIgAQPUHBMDXCwBAGgoTAMC%2FhjdA2uI9rl%2BXOxuAe07CyQS%2BN4MqxQbZpPzdsOxJ8%2B4pL3j7AkggFgB8qgD%2Bx%2BonzZfAzh07eV89wAH7axDkmTW6Qr3L9gAnAPCkZACATZtoRwYA%2BMYAAMz4VpCtIfX5v4H69RMSiqwawHvjCHKnxVlBvV5ahjSMc41vJsC4n6piYgcQlytQQJJfDSAA3oeaJs0Xxe8RkySWHWB7DQLzAcBQAIjo%2Bl8SAMBVRpowAMAcEoBmMoAClawcgwwAVAVtBgDOLwAASuLaU8XCjKEKAIvPyNrBzq8igJS6Hj7UnGzxSfBwhtEGXeYkSHN7KAJysv%2FaBE50BgHeh5q0%2Bosm26IXeH1gfw0Cc3JN1dM0AMBVi3grDQBw3SEA%2BL4frlcBXwDA4pMUFcuVjDKg97YaG5jV3AOw6pujXw3qhfNNDAEnLVpUJgE219XHjzcIxgICX0lIxNp5wwlBdIYL3meatPo1klWiFzmvPUFfwwXmTNU7F%2BwAAHp7zRebAIAfzwkA2CzzitKPSQAsXmKMYl%2BUAfr1OBCamk8lsPb8XHVfuUXq8hhySOGpImAnVD0AOd8rAvoAaWqApFkxilxwjJgNAP6X6rfOi2Zni17g9UCuNRzMA5DqPCB8EwEAsFNtGQAA%2BlQB4noABcgwG%2B1vJlUCWAsAVv%2Bv876cBMCcTMDN4XcCZA0QV%2BcrSew41wqPwB8Bi4Dc7eYKfP%2FhF62fESDNq%2FOeB7oH3lfqh9Y18LPFJBfPsgKyr%2BESc2T1zoo9AMAxReW8CQDw3SgA9snDR3QXBYBGydMy8K6uAuD%2BDhKKaStz8KnfFgk3wWulekZIxdzjxBiAt%2F8rHlE3O4CqkSBCEHEuA%2BmaPbQG3jfqh9ZL4OeOGi3e5eHtrEFifgeAYdLO67QBAOp1FP0NAQBgKkBOFQAgK5ShAAC8YaiQ%2BJ57ehhLAaCxeypB%2BOcpAAYaejDSDsH%2BA%2BiHDXIJn98ANfAaMGk26EOXCDXeN%2BqH1kuQ94gZvRDLNrC3Bkk6Bl0DBP%2BnAgB8JyDhBgDgvlcALiqgwDMANHmUznPHIwGMeSNq%2BDWvFgCc3wewB1sIdfQYuS7Gbwks95HIEM5oQsrj4W2Arg4khMjKjgP%2BZ%2Bq31kXze0U%2FB7zCgdhZw8P8BQBFAUC9u30IAGBORe0CAKA2kxUg2gEAVIQyBADAv%2BoUAOQ1QgEUeO%2FHJU3LBaBzfFRZ3m8LAFKcdcfIAYA83zBCog9AAXTjqEACpSMA3qfqLa2LZrvEDE1veRC%2Fhoc5eUSjUtsAALAX2goAoL8YALz123WHKHYA6Bw%2B2QpUsAHg%2FhSAQAAwUoCGfjFMpTsNqENtIbH6ANpr%2FSbEVCLFoEeDhU8JAP6XqtadF012xgxVlgduDR%2BYDwCGVL3XJFsAgM0aiA4A1GsUgL5LEBcAAFEAgLouBdDVOeRRFADonFCtwEjlRQECkvBSi9b%2BHFugA8ql%2F2igWK%2FSTJptrLPGBwj4VwGADv53qobWRbGzxQwb4wG%2FCgI%2BzZ5XAXxCMgDAVQPLBQBwTDAAQAHKDgBgGlu%2FRVuhVuclXk2A841pIBEB4Nroi8QZafCVSEmRGkKvTwCayXOt9pOXgDMEMgDed6qG5kXjLkkRCjvArYIgfQBQcK0B5C%2BmAABsOqmkCACwKQFoUhUAoB0IZgAA%2Fzs8BGJqS4iApwHwU93GsDQ4wRIGeOfvAMiaTkmMtjhEGfZhgFUcKjQ0%2FwGWpwP%2BB6pa%2B1WTs0QVlbM8sL8KF6SzAEBHr%2BU0AIDbwqQMAPj9qgAAvIIAUBHMHYtSYYcE9siWsfKfeyaw7teAdluFWQUY8l%2BMi8yYutfG0jznz%2F6aQB%2FAbL0YpAyLf7uA0K8GF95Xyq31FcjZIhMWwPYqHHQ6ICs662wBAGZ78moEAHy%2BB2CwHgBgNgDB9xB1DAI4j2zsb2wSAtjwviGSyl2p7WweQ1rq5ML%2F5IuH9fCM6XuaZqXlWBIs7XYkCZroAN43KtLWt8K9OsvRbeMB%2B6twCV8ApmZ4OQDAfZh4cQYAuF9SAAEA4FUiZE9pk4BK1zAyJML5xgAW8QKsIxHYf1Zn0EF%2FdS8K6F9f94jcDTuwEvuFBJxk97OQohgXBR4osqH9W1N3ixl6ZQGwvQoSPrNCdFoAAO4D8ncYAKC3KgD7r1wKSA23OlHN%2FYaA3gGRSGT%2FnTOpDC37gTEsja5BvifAcb6Zn%2BUkcEwoycJHdogJ2AbeB4pp51VRZ4ksvoyFB9YqSMyRarIKNQAA90miJwYAwLFXAC7dbZk%2BkEqPDW%2FOCeA%2BCoCgxYProM9YREPTmfRzkoId8JyCNA1m46MWZcIUaNFvSKBFOUKsUisjcwEeKLJz50uTk54rGIHoq%2FBIF4Cs3rk9GQCgUkWyCQBwNVkBAADgPYQLTg7OnnQzqsLaT54TQL9nALWDjjwMhdYTz8Gdh7GI4PNUEk0foGL4HknDa%2BoABAv%2BN4pL%2BxfkzK5yKBywswqPvIAhq3fOQgAA3iX6xwAA6IcAKEABvNsA2OwNHw68R5lU9%2FGtiO58moA50IIpvZZIWzQOJ9Cz%2FgC2y46vTL3KYPn4F4QNvAS7oKMB%2Fhfy6%2FYvTU46S6HwwN4aHmZPFZ3b2gAANmlkuwEAajMBADPskD6dBGjWCbXUnNa%2FgoS9YQehe0bogPNJk4HXKtgPRBM0eInWoM0ofzIx8EtJzZJ4rUYgLyIW3ieyc%2Bs14C6RA%2BMDO2sQmKcDUuVen7UDAFy1UEsAAPA9KgAkCwBQCg5mOQfQOe7zQaHfAgKwIF51jcoeFkdGzRbKSSDXck7%2FgFPI0sU5cGuEOFs7h9KS9XvZJUBrDx4IknP7a6BOekqhcMCvgoAPLnVfSgQA6G2hqwEAcBEAeh2Zh3YKyddmglr9%2BhtAJTLpMKRTBa4aS5MS9ZLxBLx37%2FBOrTybw8%2FpVmhe6BR7oAM%2BCKJz%2B2ukTm6XgxFwaxCYZwGkHNxhAwCAPYw7AMDrqgBoigJQBBkAG5gAQBEnZFimLDWSI9AgvmLxAQ2GFLGUQAfCq%2BMzzqUKaZUrZRJ9FhBJ%2BgIe%2BOFzz6umTtrnUHjgV%2BGQU66EapgGAKhkmAsA4HgKgId1J4EEgYHP30wglJ2OeqQugeVd1MJGKBdJ2oTqzo4HCR7Ve%2BUkCu0aXcBElWYrmkJvHywe%2BEFD%2B%2BvMNpGHAuBW4WCOLIkuWwCAoxUsEQDgfr0CcIZ8lQEhadYn4KAWNwLaNhLtXkF0Jww1wBBSeJraa0vJKObw%2B0tE5fUT6QJCCx0HHviBuetl4idJCowH%2FBokpimFfOEAAEeHuzIAwFVaATzUACxeqHTNxfHPkg2%2Fksa5WMDnWGuA8IOnT1gy6YQPcobT7Kju%2Bk4Cqn0caNzdilOim1IFHggiY%2FvLzE5JisRGwPYqSPjkLjvW2gAAHBPg3wgAgKEAvF9to70oFo%2BfRDXHSNPo2QEIOvrX7CFVF0qbW25NCSFlUuqMyT7FQKt3i2kdZxWKyvnLcSb%2BzlCKAx3%2B54G5%2Fdr5yS0pGB9YqyDhU3JRIw0AQNmJ3i0AAPdjCoD1xoFHSer9RB17LWiwOJoF55FIg5o4ZlgT0B%2FnJv0NSY9HUKIKU%2BS%2FwWuOYP7WEW%2Fq8AAeCBLDcUHHxyMdjED0VQA%2BU0nsWAEA%2Bk6RoQIAfI8CgA2qNZ6XWkXZ7GVF6RMcCEUsAvg7Z7Logp1Lgc8uGoFRlEfgFK5NunP3VbqMwEsVGskCvvch83Fgwi3BImIEZ60CmIPLiXcBAPheQQMDAOA7AQBHWy0pL1epA12GpdajLzO7LfS4wHYijWNyzYtoNMW6jvdfs53E0Z%2Fc0CsZXmVk7CPWsrqveWBHWeULHtgRreurs7eHCoyAvgYBN7mceGoAALy2kDMFALhPFQAEgAPdt3W9elPUydzgMJhMgLdYFF38XFlbmi7M%2FNWawxHZN1jmwzLrirFe15P%2F05O2jf49AL7HIUP7VyW3%2BwuMQO6sQWBOpnA8MQEANl3oXwIAUFYBQFEAD22fqvea9UoIpq2mB9QLkGg%2BIC295%2BC4nAJmnb6zPtwli4JlM2NM1ZOpJwpoS%2BSwdK45FAHe1xFj%2B2snJ6ECI5B7axCkCkm8mQAA2Knc0QAA9J0CgF8fAE37exRYxJtABHnvMRj8YztjvMOwIfUmSGC9traXCmyfqhVad%2F%2FK6rCl5eFgvmIBvsdRXftXxzv9BUbArQF4tkpi1wAAOKaqXnIAgNc1AGAO4GjmJ57%2BSveeUDr5UbjN2UOmu2SjUWrgAg%2FiXBu8a1AHvWwu9RUG3mqn6Gc6eVcwzBna%2Bm%2FmWmBbA963Ma3z2vEmVGB84FfhwK2SE%2B8ZAOB7FCYUAMD3AgC0K872oTJT6tl2pJvjYoZhw0HlqXlMEjEzy6JWEklxXPJ3xqrPMmqndd5%2F6oWPKmfdvXNmvscJZedrZo%2F7C4yAWwXIEXKMNhMA4DsECwcAeO1WAHgf8B7CftRNCR7SHXS51erQkd3FnJSajCwnSgmV5Szn8LRHhhUusIzYnCs%2BFHlylsMY4ImuDb7HMV37ayUf35cIGA%2F4NUg4T0ji2wEAjikwLACA3kYB0GMBjsKJL73CY29MtlFee%2FoCVPyYsSka3blC778AcSd8tXxqLTW0fhvpur1i2KV2zIhnYGwM3qdJks51ko8Hh9kIxK1BYuVcElYLAAC2cDACAFSSAuC%2BATyQPpPBXGmY%2B2EOZens5hCi60o3HS56k9LKky6SfAdcnbMO97XujEHUX9WYtrTYtNN0AN7HCa39UuWdwYPxgV8DZDlJvBUAQN8BX2YAgPtUBcDMEmDZZfb8SGOdtunvnqOMHasv7X%2BuYqWNBRq2le0pI30gyheRsrgv5EykkquFtlp3Ngx8YBPel%2BlC62WWD8GDEdDXADxLToSsAACvaeRzBQD47gEAGy146Kbv1rk3%2BPkmG%2BHY%2BEAftVQF6Ryl1w5Fs3OLr3IOA%2F12X2XUuVPMUoh3p3437Xo5V%2B2tt2%2FlAb6XaWnzOpMbcwTyA9YaIJGdJH4FAOC1hZ4XAID7FAGAhPMTj2VBXVR8Ru38GAqfw6qCAwfOA0oq9AFOfOD1ppW8obyzS1MhyvbdcVr92QnJ9dAT3pcZk%2BZ1ZicJCUYg%2BxoELKQQZwYAwKZLxaoAALNVANBtApauv9P0k5Q7RhpgNQ4VJ%2FHVjjlU45T7n40DY6Ko%2FB48gfEw5I7WRXTe6Mkz%2BFgsC09nZ1MABGa7AAAAAAAAL0QAAAQAAADEnHtoDU5NUU5KT0RLPDAuYUm%2BtxlC8%2Bjsdt%2FBCORag4BnSeKrAgCQojomAAB9uyCArgga3bf1nhdZmi29RgvTe0MND1GFEO5RVqbzqdbvke1wbR7lNTjtHK0BGSBcdRLep1mS5tzJTfBgBPQ1AJMkcdkEADgmIy8oAMDrGgBQdHBAbX%2FHLvQ1fArA%2FpZlqb%2FyXJFjhQ1qBU173uG9jhUP8h1Zf1GQC55JFJtLAd6X2bj63PkiODACdtZw4NnJiVsGAMB3RP8BAPDvZQDACjjoa8njGYIQdXTzxzbahXdd6XgFbsyZnQLQCl2gPqMKq0%2FmUE5pMiKaG9gsCKUMAN6X2Zlqr3wRLDA%2BsLcGCZMk8Z4GALgPIXc1AACvHQoAGrQrmPZkiVQF3PCj57hjcpMiTzi0wrC1dhY6OpYzJ7O90CiXb1F1PrTpQulLAt6XOamyTnIQTCAH3BokZoQknpkAALOdcMEBANxQCiBmcY%2Fyj65ZzVIm1d4ND18jdUpozAsX"
},

//. compass
compass: [
	{ name: '北東', x:  1, y:  1 },
	{ name: '北西', x: -1, y:  1 },
	{ name: '南東', x:  1, y: -1 },
	{ name: '南西', x: -1, y: -1 }
],

//. fortresses
fortresses: (function() {
	var data = [[
		[0, 0],
		[ 12, 28], [ 28, 12], [ 12, 52], [ 36, 36], [ 52, 12], [ 12, 76], [ 36, 60], [ 60, 36], [ 76, 12], [ 12,100],
		[ 36, 84], [ 60, 60], [ 84, 36], [100, 12], [ 12,124], [ 36,108], [ 60, 84], [ 84, 60], [108, 36], [124, 12],
		[ 12,148], [ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [148, 12], [ 36,156], [ 60,132], [ 84,108],
		[108, 84], [132, 60], [156, 36], [ 60,156], [ 84,132], [108,108], [132, 84], [156, 60], [ 84,156], [108,132],
		[132,108], [156, 84], [108,156], [132,132], [156,108], [132,156], [156,132], [156,156]
	],
	[
		[0, 0],
		[ 12, 28], [ 28, 12], [ 12, 52], [ 36, 36], [ 52, 12], [ 12, 76], [ 36, 60], [ 60, 36], [ 76, 12], [ 12,100],
		[ 36, 84], [ 60, 60], [ 84, 36], [100, 12], [ 12,124], [ 36,108], [ 60, 84], [ 84, 60], [108, 36], [124, 12],
		[ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [ 60,132], [ 84,108], [108, 84], [132, 60], [ 84,132],
		[108,108], [132, 84], [108,132], [132,108], [132,132]
	]];

	return [ [], data[0], data[0], data[0], data[0], data[1] ][ Env.chapter ] || [];
})(),

//. countries
countries: (function() {
	return [
		[],
		//第１章
		['dummy', '織田家', '足利家', '武田家', '上杉家', '徳川家', '毛利家', '浅井家', '北条家', '長宗我部家', '島津家', '大友家', '最上家'],
		//第２章
		['dummy', '織田家', '足利家', '武田家', '上杉家', '徳川家', '毛利家', '伊達家', '北条家', '長宗我部家', '島津家', '豊臣家', '最上家'],
		//第３章
		['dummy', '織田家', '黒田家', '武田家', '上杉家', '徳川家', '毛利家', '伊達家', '北条家', '長宗我部家', '島津家', '豊臣家', '石田家'],
		//第４章
		['dummy', '織田家', '足利家', '武田家', '上杉家', '徳川家', '毛利家', '浅井家', '北条家', '長宗我部家', '島津家', '大友家', '最上家'],
		//第５章
		['dummy', '織田家', '足利家', '武田家', '上杉家', '徳川家', '毛利家', '伊達家', '北条家', '長宗我部家', '島津家', '豊臣家', '最上家'],
	][ Env.chapter ] || [];
})(),

//. npcPower
npcPower: null,

//. getNpcPower
getNpcPower: function() {
	var data = [{
		//１章、２章
		//★１
		'1-10000': [245, 185, 155, 203],
		'1-01000': [185, 155, 245, 173],
		//★２
		'2-00200': [520, 520, 520, 448],
		'2-00010': [370, 550, 430, 370],
		//★３
		'3-20100': [2170, 1210,  730, 1498],
		'3-02100': [1210,  730, 2170, 1018],
		'3-00120': [ 730, 2170, 1210, 1018],
		//★４
		'4-30100': [4890, 3170, 2310, 3686],
		'4-03001': [3220, 2210, 5240, 2816],
		'4-00310': [3200, 3200, 3200, 3200],
		'4-00031': [2320, 5080, 3240, 2872],
		//★５
		'5-40110': [17360, 11390,  6445, 12341],
		'5-04110': [11470,  5985, 17680,  8868],
		'5-00402': [11800, 11800, 11800, 10360],
		'5-00052': [ 6370, 17785, 11540,  8536],
		'5-32230': [15250,  8050, 12850, 10930],
		//★６
		'6-50111': [62250, 31550, 16200, 40760],
		'6-05111': [31960, 17510, 60860, 26180],
		'6-10511': [61600, 61600, 61600, 61600],
		'6-22280': [16900, 62500, 32100, 26020],
		//★７
		'7-55552': [186700,  94200,  47950, 121950],
		'7-12110': [103700,  57800, 195500,  85340],
		'7-44503': [104800, 104800, 104800, 104800],
		'7-22230': [ 46950, 187800,  93900,  75120]
	},
	{
		//３章、４章
		//★１
		'1-10000': [245, 185, 155, 203],
		'1-01000': [185, 155, 245, 173],
		//★２
		'2-10010': [370, 550, 430, 370],
		'2-00200': [520, 520, 520, 448],
		//★３
		'3-11100': [1210,  730, 2170, 1018],
		'3-11110': [2170, 1210,  730, 1498],
		'3-01101': [ 730, 2170, 1210, 1018],
		//★４
		'4-20001': [5930, 3835, 2788, 4464],
		'4-12000': [3840, 2640, 6240, 3360],
		'4-00210': [2790, 6120, 3900, 3456],
		'4-11021': [3840, 3840, 3840, 3840],
		//★５
		'5-50002': [19910, 10550, 16790, 14292],
		'5-30021': [ 8320, 23140, 15080, 11128],
		'5-13020': [15340, 15340, 15340, 13468],
		'5-02300': [ 8385, 15763, 15470,  9464],
		'5-01520': [23200, 15400,  8700, 16540],
		'5-30140': [14970,  7810, 23340, 11596],
		//★６
		'6-30210': [39178, 21578, 74378, 32138],
		'6-14321': [56900, 28450, 50800, 40120],
		'6-23122': [86960, 44160, 22760, 57000],
		'6-13432': [63200, 61100, 32750, 50030],
		'6-22242': [51400, 25700, 56600, 37160],
		'6-03340': [22010, 81410, 41810, 33890],
		//★７
		'7-42402': [210200, 114200,  66200, 143000],
		'7-89331': [225000, 112500,  56250, 146250],
		'7-13221': [112020,  64020, 208020,  92820],
		'7-41151': [111000,  55500, 222000,  88800],
		'7-52630': [ 58000, 232000, 116000,  92800],
		'7-43510': [ 67800, 202800, 112800,  94800],
		//★８
		'8-62211': [243220, 132670,  93320, 167200],
		'8-15112': [ 98560, 181360, 126160, 115120],
		'8-21601': [125620,  95820, 230020, 109860],
		'8-33310': [124800, 124800, 124800, 124800]
	},
	{
		//５章
		//★１
		'1-10000': [245, 185, 430, 370],
		'1-01000': [155, 245, 185, 173],
		//★２
		'2-00201': [370, 550, 155, 203],
		'2-11020': [520, 520, 520, 448],
		//★３
		'3-11101': [ 735, 2265, 1245, 1041],
//同じ資源数なので、それぞれの兵科で高い方を採用
//		'3-11110': [1245,  735, 2265, 1041],
//		'3-11110': [2265, 1245,  735, 1551],
		'3-11110': [2265, 1245, 2265, 1551],
		//★４
		'4-11101': { '雑賀衆': 125, '農民': 375 },
		'4-12100': { '海賊衆': 100, '農民': 350, '抜け忍': 50 },
		'4-11210': { '国人衆': 110, '農民': 355, '浪人': 75 },
		'4-21131': { '母衣衆': 120, '農民': 360, '野盗': 25 },
		//★５
		'5-50201': { '国人衆': 145, '母衣衆': 625, '農民': 240 },
		'5-32010': { '雑賀衆': 125, '浪人': 610, '抜け忍': 305 },
		'5-23010': { '国人衆': 560, '海賊衆': 95, '農民': 280, '浪人': 235 },
		'5-10501': { '雑賀衆': 375, '浪人': 190, '抜け忍': 190, '野盗': 190 },
		'5-01520': { '海賊衆': 590, '母衣衆': 100, '農民': 295 },
		'5-04150': { '国人衆': 170, '農民': 170, '浪人': 280, '野盗': 560 },
		//★６
		'6-22210': { '国人衆': 1085, '浪人': 1085, '抜け忍': 1085 },
		'6-43311': { '国人衆': 1660, '雑賀衆': 210, '浪人': 1245 },
		'6-45232': { '武士': 825, '国人衆': 515, '抜け忍': 1545 },
		'6-25132': { '母衣衆': 1455, '雑賀衆': 100, '野盗': 1260 },
		'6-32431': { '海賊衆': 1320, '農民': 790, '野盗': 1145 },
		'6-11450': { '海賊衆': 1440, '雑賀衆': 90, '抜け忍': 1170 },
		//★７
		'7-15152':  { '赤備え': 1200, '野盗': 7175 },
		'7-22230':  { '農民': 1125, '野盗': 7875, '鬼': 115 },
		'7-12630':  { '武士': 1225, '浪人': 7335 },
		'7-910651': { '農民': 465, '浪人': 1860, '抜け忍': 1860, '野盗': 1860, '鬼': 465 },
		'7-52222':  { '弓騎馬': 1295, '抜け忍': 6475, '野盗': 650 },
		'7-33341':  { '農民': 520, '抜け忍': 5165, '鬼': 520 },
		//★８
		'8-72221': { '国人衆': 1750, '母衣衆': 875, '雑賀衆': 1310, '浪人': 5240, '鬼': 90, '天狗': 5 },
		'8-27213': { '国人衆': 370, '海賊衆': 1105, '雑賀衆': 370, '抜け忍': 2940, '鬼': 735, '天狗': 5 },
		'8-22702': { '母衣衆': 1575, '野盗': 2950, '鬼': 790, '天狗': 5 },
		'8-33342': { '鬼': 905, '天狗': 455 }
	}];

	data = [ {}, data[0], data[0], data[1], data[1], data[2] ][ Env.chapter ] || {};

	if ( Env.chapter <= 4 ) {
		Data.npcPower = data;
		return data;
	}

	var soldata = Soldier();
	var paneldata = {};

	for ( var key in data ) {
		let panel = data[ key ],
			def = { '槍': 0, '弓': 0, '馬': 0, '器': 0 },
			[ rank, material ] = key.split('-');

		if ( 1 <= rank && rank <= 3 ) {
			paneldata[ key ] = panel;
			continue;
		}

		for ( var solname in panel ) {
			let { defend, command } = soldata[ solname ],
				solnum = panel[ solname ],
				mod = 1;

			if ( 4 <= rank && rank <= 6 && Env.season >= 3 ) {
				mod = 1 + ( Env.season - 2 ) / 10;
			}
			else if ( 7 <= rank && rank <= 8 ) {
				mod = 1 + ( Env.season - 1 ) / 10;
			}

			solnum = Math.floor( solnum * mod / 5 ) * 5;
			command = ( command == '他' ) ? '器' : command;
			def[ command ] += solnum * defend;
		}

		paneldata[ key ] = [
			Math.ceil( def['槍'] + def['弓'] * 2 + def['馬'] * 0.5 + def['器'] ),
			Math.ceil( def['槍'] * 0.5 + def['弓'] + def['馬'] * 2 + def['器'] ),
			Math.ceil( def['槍'] * 2 + def['弓'] * 0.5 + def['馬'] + def['器'] ),
			Math.ceil( def['槍'] * 0.8 + def['弓'] * 1.3 + def['馬'] * 0.8 + def['器'] )
		];
	}

	Data.npcPower = paneldata;
	return paneldata;
},

//. hpRecovery
hpRecovery: {
	'天': 900, '極': 780, '特': 720, '上': 660, '序': 600,
	'剣': [ 30, 32, 34, 36, 38, 40, 44, 48, 52, 56, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120 ]
},

//. skillTable
skillTable: {
//.. 槍
	'槍隊進撃':		[ '槍隊進撃', '槍隊備え', '騎馬隊進撃', '槍隊襲撃', '槍隊突撃' ],
	'槍隊襲撃':		[ '槍隊襲撃', '槍隊進撃', '騎馬隊襲撃', '槍隊堅守', '兵器突撃' ],
	'槍隊急襲':		[ '槍隊急襲', '騎馬隊急襲', '弓隊急襲', '槍隊守備', '槍隊挟撃' ],
	'金爆 槍撃':	[ '金爆 槍撃', '槍隊布陣', '城崩し', '槍撃の真髄', '槍隊挟撃' ],
	'槍撃の真髄':	[ '槍隊奇襲', '槍隊守護', '槍隊挟撃', '槍衾', '剣術 攻乃型' ],
	'槍隊突撃':		[ '槍隊突撃', '槍隊布陣', '騎馬隊突撃', '槍隊奇襲', '槍隊挟撃' ],
	'槍隊奇襲':		[ '槍隊奇襲', '槍隊突撃', '騎馬隊奇襲', '槍隊堅陣', '槍隊挟撃' ],
	'槍隊挟撃':		[ '槍隊挟撃', '騎馬隊挟撃', '弓隊挟撃', '槍隊守護', '槍隊剛撃' ],
	'槍隊剛撃':		[ '槍隊剛撃', '槍隊円陣', '騎馬隊剛撃', '足軽軍法', '槍撃 修羅' ],
	'槍隊乱撃':		[ '槍隊乱撃', '槍隊円陣', '騎馬隊乱撃', '啄木鳥', '槍撃 修羅' ],
	'鬼小島':		[ '槍隊剛撃', '槍隊円陣', '騎馬隊剛撃', '槍撃 修羅', '' ],
	'天槍の神技':	[ '槍隊剛撃', '槍陣の極み', '弓撃 夜叉', '天賦の神算', '天賦の神算' ],
	'槍撃 修羅':	[ '槍隊剛撃', '槍陣の極み', '騎突 金剛', '剣豪将軍', '剣豪将軍' ],
	'姫鬼無双':		[ '槍撃 修羅', '神速', '剣聖', '破軍星', '騎神' ],

	'槍隊備え':		[ '槍隊備え', '槍隊進撃', '騎馬隊備え', '槍隊堅守', '槍隊布陣' ],
	'槍隊堅守':		[ '槍隊堅守', '槍隊備え', '騎馬隊堅守', '槍隊襲撃', '槍隊堅陣' ],
	'槍隊守備':		[ '槍隊守備', '騎馬隊守備', '弓隊守備', '槍隊急襲', '槍隊守護' ],
	'槍隊布陣':		[ '槍隊布陣', '槍隊突撃', '騎馬隊布陣', '槍隊堅陣', '槍隊守護' ],
	'槍隊堅陣':		[ '槍隊堅陣', '騎馬隊堅陣', '槍隊布陣', '槍隊奇襲', '槍隊守護' ],
	'槍隊守護':		[ '槍隊守護', '騎馬隊守護', '弓隊守護', '槍隊挟撃', '槍隊円陣' ],
	'槍隊円陣':		[ '槍隊円陣', '槍隊剛撃', '騎馬隊円陣', '足軽軍法', '槍陣の極み' ],
	'槍陣の極み':	[ '槍隊円陣', '槍撃 修羅', '馬陣の極み', '柳生新陰流', '柳生新陰流' ],
	'甲駿の誓い':	[ '槍隊円陣', '槍撃 修羅', '槍陣の極み', '鉄壁の備え', '' ],

//.. 弓
	'弓隊進撃':		[ '弓隊進撃', '弓隊備え', '槍隊進撃', '弓隊襲撃', '弓隊突撃' ],
	'弓隊襲撃':		[ '弓隊襲撃', '弓隊進撃', '槍隊襲撃', '弓隊堅守', '弓隊奇襲' ],
	'弓隊急襲':		[ '弓隊急襲', '槍隊急襲', '騎馬隊急襲', '弓隊守備', '弓隊挟撃' ],
	'金爆 弓撃':	[ '金爆 弓撃', '弓隊布陣', '謀殺', '弓撃の真髄', '弓隊挟撃' ],
	'弓撃の真髄':	[ '弓隊奇襲', '弓隊守護', '弓隊挟撃', '三矢の教え', '剣術 攻乃型' ],
	'弓隊突撃':		[ '弓隊突撃', '弓隊布陣', '槍隊突撃', '弓隊奇襲', '弓隊挟撃' ],
	'弓隊奇襲':		[ '弓隊奇襲', '弓隊突撃', '槍隊奇襲', '弓隊堅陣', '弓隊挟撃' ],
	'弓隊挟撃':		[ '弓隊挟撃', '槍隊挟撃', '騎馬隊挟撃', '弓隊守護', '弓隊剛撃' ],
	'弓隊剛撃':		[ '弓隊剛撃', '弓隊円陣', '槍隊剛撃', '槍弓猛襲', '弓撃 夜叉' ],
	'弓隊乱撃':		[ '弓隊乱撃', '弓隊円陣', '槍隊乱撃', '啄木鳥', '弓撃 夜叉' ],
	'弓撃 夜叉':	[ '', '', '', '天賦の神算', '' ],
	'三矢の神技':	[ '弓隊剛撃', '弓陣の極み', '槍撃 修羅', '天賦の神算', '天賦の神算' ],

	'弓隊備え':		[ '弓隊備え', '弓隊進撃', '槍隊備え', '弓隊堅守', '弓隊布陣' ],
	'弓隊堅守':		[ '弓隊堅守', '弓隊備え', '槍隊堅守', '弓隊襲撃', '弓隊堅陣' ],
	'弓隊守備':		[ '弓隊守備', '槍隊守備', '騎馬隊守備', '弓隊急襲', '弓隊守護' ],
	'弓隊布陣':		[ '弓隊布陣', '弓隊突撃', '槍隊布陣', '弓隊堅陣', '弓隊守護' ],
	'弓隊堅陣':		[ '弓隊堅陣', '槍隊堅陣', '弓隊布陣', '弓隊奇襲', '弓隊守護' ],
	'弓隊守護':		[ '弓隊守護', '槍隊守護', '騎馬隊守護', '弓隊挟撃', '弓隊円陣' ],
	'弓隊円陣':		[ '弓隊円陣', '弓隊剛撃', '槍隊円陣', '矢雨備え', '弓陣の極み' ],
	'弓陣の極み':	[ '弓隊円陣', '弓撃 夜叉', '槍陣の極み', '戦陣 千鳥', '戦陣 千鳥' ],
	'三矢の礎':		[ '組撃ち', '弓撃 夜叉', '弓陣の極み', '戦陣 千鳥', '捨て奸' ],

//.. 馬
	'騎馬隊進撃':	[ '騎馬隊進撃', '騎馬隊備え', '弓隊進撃', '騎馬隊襲撃', '騎馬隊突撃' ],
	'騎馬隊襲撃':	[ '騎馬隊襲撃', '騎馬隊進撃', '槍隊襲撃', '騎馬隊堅守', '騎馬隊奇襲' ],
	'騎馬隊急襲':	[ '騎馬隊急襲', '弓隊急襲', '槍隊急襲', '騎馬隊守備', '騎馬隊挟撃' ],
	'金爆 騎突':	[ '金爆 騎突', '騎馬隊布陣', '大ふへん者', '騎突の真髄', '騎馬隊挟撃' ],
	'騎突の真髄':	[ '騎馬隊奇襲', '騎馬隊守護', '騎馬隊挟撃', '弓馬構え', '剣術 攻乃型' ],
	'騎馬隊突撃':	[ '騎馬隊突撃', '騎馬隊布陣', '弓隊突撃', '騎馬隊奇襲', '騎馬隊挟撃' ],
	'騎馬隊奇襲':	[ '騎馬隊奇襲', '騎馬隊突撃', '弓隊奇襲', '騎馬隊堅陣', '騎馬隊挟撃' ],
	'騎馬隊挟撃':	[ '騎馬隊挟撃', '弓隊挟撃', '槍隊挟撃', '騎馬隊守護', '騎馬隊剛撃' ],
	'騎馬隊剛撃':	[ '騎馬隊剛撃', '騎馬隊円陣', '弓隊剛撃', '乗り崩し', '騎突 金剛' ],
	'騎馬隊乱撃':	[ '騎馬隊乱撃', '騎馬隊円陣', '弓隊乱撃', '啄木鳥', '騎突 金剛' ],
	'騎突 金剛':	[ '', '', '', '剛勇無双', '' ],
	'騎神烈破':		[ '騎馬隊剛撃', '馬陣の極み', '弓撃 夜叉', '剛勇無双', '剛勇無双' ],

	'騎馬隊備え':	[ '騎馬隊備え', '騎馬隊進撃', '弓隊備え', '騎馬隊堅守', '騎馬隊布陣' ],
	'騎馬隊堅守':	[ '騎馬隊堅守', '騎馬隊備え', '弓隊堅守', '騎馬隊襲撃', '騎馬隊堅陣' ],
	'騎馬隊守備':	[ '', '', '', '騎馬隊急襲', '' ],
	'騎馬隊布陣':	[ '騎馬隊布陣', '騎馬隊突撃', '弓隊布陣', '騎馬隊堅陣', '騎馬隊守護' ],
	'騎馬隊堅陣':	[ '騎馬隊堅陣', '槍隊堅陣', '騎馬隊布陣', '騎馬隊奇襲', '騎馬隊守護' ],
	'騎馬隊守護':	[ '騎馬隊守護', '弓隊守護', '槍隊守護', '騎馬隊挟撃', '騎馬隊円陣' ],
	'騎馬隊円陣':	[ '騎馬隊円陣', '騎馬隊剛撃', '弓隊円陣', '真田丸', '馬陣の極み' ],
	'馬陣の極み':	[ '', '', '', '天賦の神算', '' ],

//.. 砲
	'鉄砲隊進撃':	[ '鉄砲隊進撃', '鉄砲隊備え', '兵器進撃', '城破り', '鉄砲隊突撃' ],
	'砲撃の真髄':	[ '鉄砲隊奇襲', '鉄砲隊守護', '鉄砲隊挟撃', '釣瓶撃ち', '剣術 攻乃型' ],
	'鉄砲隊突撃':	[ '鉄砲隊突撃', '鉄砲隊布陣', '兵器突撃', '鉄砲隊奇襲', '鉄砲隊挟撃' ],
	'鉄砲術 小雀':	[ '鉄砲隊突撃', '鉄砲隊布陣', '兵器突撃', '', '鉄砲隊挟撃' ],
	'鉄砲隊奇襲':	[ '鉄砲隊奇襲', '鉄砲隊突撃', '防壁砕き', '鉄砲隊堅陣', '鉄砲隊挟撃' ],
	'鉄砲隊挟撃':	[ '鉄砲隊挟撃', '国貫き', '兵器運用術', '鉄砲隊守護', '鉄砲隊剛撃' ],
	'鉄砲術 蛍':	[ '迅速行軍', '槍隊奇襲', '義兵進軍', '釣瓶撃ち', '鉄砲隊剛撃' ],
	'鉄砲隊剛撃':	[ '鉄砲隊剛撃', '鉄砲隊円陣', '城崩し', '三段撃 烈火', '砲撃 羅刹' ],
	'鉄砲隊乱撃':	[ '鉄砲隊乱撃', '鉄砲隊円陣', '謀殺', '三段撃 烈火', '砲撃 羅刹' ],
	'三段撃 神速':	[ '三段撃 神速', '弾幕防壁陣', '刹那の猛勇', '三段撃 烈火', '砲撃 羅刹' ],
	'砲撃 羅刹':	[ '', '', '', '釣り野伏 鬼', '' ],
	'釣り野伏 鬼':	[ '砲撃 羅刹', '組撃ち', '槍撃 修羅', '釣り野伏 鬼', '捨て奸' ],
	'鉄甲水軍':		[ '鉄砲隊剛撃', '砲陣の極み', '城崩 奈落', '釣り野伏 鬼', '釣り野伏 鬼' ],
	'三段撃 激烈':	[ '砲撃 羅刹', '独眼竜', '捨て奸', '神算鬼謀 滅', '破軍星' ],
	'魔王三段撃':	[ '組撃ち', '剣聖', '三段撃 激烈', '神算鬼謀 滅', '騎神' ],
	'繰抜十字紋':	[ '組撃ち', '剣聖', '釣り野伏 真', '神算鬼謀 滅', '騎神' ],

	'鉄砲隊備え':	[ '鉄砲隊備え', '鉄砲隊進撃', '弓隊堅守', '防壁破り', '鉄砲隊堅陣' ],
	'鉄砲隊布陣':	[ '鉄砲隊布陣', '鉄砲隊突撃', '兵器布陣', '鉄砲隊堅陣', '鉄砲隊守護' ],
	'鉄砲隊堅陣':	[ '鉄砲隊堅陣', '兵器布陣', '鉄砲隊布陣', '鉄砲隊奇襲', '鉄砲隊守護' ],
	'鉄砲隊守護':	[ '鉄砲隊守護', '兵器布陣', '迅速行軍', '鉄砲隊挟撃', '鉄砲隊円陣' ],
	'鉄砲隊円陣':	[ '鉄砲隊円陣', '鉄砲隊剛撃', '神行法', '弾幕防壁陣', '砲陣の極み' ],
	'砲陣の極み':	[ '', '', '', '八咫烏', '' ],
	'釣り野伏 真':	[ '組撃ち', '捨て奸', '神速', '破軍星', '天衣無縫陣' ],

//.. 器
	'兵器進撃':		[ '兵器進撃', '騎馬隊備え', '防壁破り', '鉄砲隊進撃', '兵器突撃' ],
	'城破り':		[ '城破り', '槍隊備え', '兵器進撃', '槍隊急襲', '城砕き' ],
	'防壁破り':		[ '防壁破り', '弓隊備え', '城破り', '鉄砲隊備え', '国貫き' ],
	'金爆 砲撃':	[ '金爆 砲撃', '兵器布陣', '迅速行軍', '砲撃の真髄', '鉄砲隊挟撃' ],
	'兵器突撃':		[ '兵器突撃', '兵器布陣', '鉄砲隊突撃', '迅速行軍', '兵器運用術' ],
	'城砕き':		[ '城砕き', '兵器布陣', '兵器運用術', '防壁砕き', '国貫き' ],
	'防壁砕き':		[ '防壁砕き', '兵器突撃', '鉄砲隊奇襲', '兵器運用術', '国貫き' ],
	'国貫き':		[ '国貫き', '兵器布陣', '迅速行軍', '兵器運用術', '城崩し' ],
	'国潰し':		[ '乗り崩し', '矢雨備え', '啄木鳥', '弓隊円陣', '電光石火' ],
	'城崩し':		[ '城崩し', '槍衾', '電光石火', '謀殺', '城崩 奈落' ],
	'郭破城':		[ '城崩し', '槍衾', '電光石火', '謀殺', '城崩 奈落' ],
	'城崩 奈落':	[ '', '', '', '鬼謀 国砕', '' ],
	'轟音 無鹿':	[ '城崩 奈落', '神算鬼謀', '背水之陣', '天衣無縫陣', '神算鬼謀 滅' ],

	'兵器布陣':		[ '兵器布陣', '兵器突撃', '兵器運用術', '城砕き', '槍衾' ],

//.. 複合攻
	'三矢の教え':	[ '三矢の教え', '弓隊円陣', '弓隊剛撃', '三段撃ち', '弓撃 夜叉' ],
	'獅子奮迅':		[ '三矢の教え', '弓隊円陣', '弓隊剛撃', '三段撃ち', '弓撃 夜叉' ],
	'夕静':			[ '槍隊挟撃', '騎馬隊剛撃', '電光石火', '鉄甲陣', '槍撃 修羅' ],
	'槍弓猛襲':		[ '槍弓猛襲', '弓馬構え', '啄木鳥', '足軽軍法', '弓撃 夜叉' ],
	'殺生関白':		[ '槍弓猛襲', '弓馬構え', '啄木鳥', '足軽軍法', '弓撃 夜叉' ],
	'七槍の剛':		[ '槍隊剛撃', '弓隊剛撃', '槍隊円陣', '三段撃 烈火', '義兵進軍' ],
	'槍弓連撃':		[ '槍弓連撃', '槍馬連撃', '弓砲連撃', '弓陣の極み', '' ],
	'旋風華憐':		[ '車懸り', '槍陣の極み', '槍撃 修羅', '車懸り 白狐', '' ],
	'乗り崩し':		[ '乗り崩し', '騎馬隊円陣', '騎馬隊剛撃', '鬼刺', '騎突 金剛' ],
	'啄木鳥':		[ '啄木鳥', '騎馬隊円陣', '騎馬隊剛撃', '槍弓猛襲', '騎突 金剛' ],
	'虎舞燦爛':		[ '乗り崩し', '騎馬隊円陣', '騎馬隊剛撃', '鬼刺', '騎突 金剛' ],
	'三段撃ち':		[ '三段撃ち', '鉄砲隊円陣', '鉄砲隊剛撃', '三段撃 烈火', '砲撃 羅刹' ],
	'弓砲連撃':		[ '弓砲連撃', '馬砲連撃', '槍弓連撃', '砲陣の極み', '砲撃 羅刹' ],
	'火竜の術':		[ '火竜の術', '土壁の術', '疾風迅雷', '謀殺', '城崩 奈落' ],
	'夢想宴舞':		[ '火竜の術', '土壁の術', '疾風迅雷', '謀殺', '城崩 奈落' ],
	'炮烙の計':		[ '火竜の術', '土壁の術', '疾風迅雷', '謀殺', '城崩 奈落' ],
	'鬼刺':			[ '鬼刺', '槍衾', '宝蔵院流', '乗り崩し', '槍撃 修羅' ],
	'足軽軍法':		[ '足軽軍法', '鉄壁の備え', '三矢の教え', '乗り崩し', '槍撃 修羅' ],
	'七槍の智':		[ '槍隊剛撃', '城崩し', '槍隊円陣', '剛勇無双', '義兵進軍' ],
	'天下剛断':		[ '乗り崩し', '槍隊剛撃', '城崩し', '義兵進軍', '城崩 奈落' ],
	'三段撃 烈火':	[ '三段撃 烈火', '城崩し', '三段撃ち', '三段撃 神速', '砲撃 羅刹' ],
	'武運長久':		[ '三段撃 烈火', '城崩し', '三段撃ち', '三段撃 神速', '砲撃 羅刹' ],
	'七槍の武':		[ '槍隊剛撃', '鉄砲隊剛撃', '槍隊円陣', '三段撃 烈火', '義兵進軍' ],
	'槍陣 弧月':	[ '槍隊剛撃', '槍隊円陣', '騎馬隊剛撃', '足軽軍法', '槍撃 修羅' ],
	'六蓮鬼突き':	[ '槍隊剛撃', '槍隊円陣', '騎馬隊剛撃', '足軽軍法', '槍撃 修羅' ],
	'虎牙猛撃':		[ '槍隊剛撃', '槍隊円陣', '騎馬隊剛撃', '足軽軍法', '槍撃 修羅' ],
	'進撃 四獣操':	[ '槍隊剛撃', '弓陣の極み', '騎突 金剛', '槍撃 修羅', '' ],
	'甲虎襲踏':		[ '騎馬隊剛撃', '弓隊円陣', '槍隊剛撃', '車懸り', '剛勇無双' ],
	'越龍滅閃':		[ '騎馬隊剛撃', '槍隊円陣', '弓隊剛撃', '車懸り', '剛勇無双' ],
	'傾奇戦国一':	[ '大ふへん者', '槍隊剛撃', '義兵進軍', '鬼刺', '刹那の猛勇' ],
	'都忘れ':		[ '槍衾', '弓馬構え', '槍陣 弧月', '鬼刺', '弓撃 夜叉' ],
	'地黄八幡':		[ '騎馬隊剛撃', '騎馬隊円陣', '弓隊剛撃', '乗り崩し', '騎突 金剛' ],
	'槍馬連撃':		[ '槍馬連撃', '槍弓連撃', '馬砲連撃', '槍陣の極み', '槍撃 修羅' ],
	'旋風轟撃':		[ '騎馬隊剛撃', '騎馬隊円陣', '弓隊剛撃', '乗り崩し', '騎突 金剛' ],
	'馬砲連撃':		[ '馬砲連撃', '弓砲連撃', '槍馬連撃', '馬陣の極み', '騎突 金剛' ],
	'赤備 烈火':	[ '槍隊剛撃', '天賦の神算', '車懸り', '神算鬼謀', '神将' ],
	'七槍の勇':		[ '槍隊剛撃', '騎馬隊剛撃', '槍隊円陣', '剛勇無双', '義兵進軍' ],
	'剛勇無双':		[ '槍撃 修羅', '馬陣の極み', '騎突 金剛', '剛勇無双', '神将' ],
	'豪勇無比':		[ '槍撃 修羅', '馬陣の極み', '騎突 金剛', '剛勇無双', '神将' ],
	'風流嵐舞':		[ '槍撃 修羅', '馬陣の極み', '騎突 金剛', '剛勇無双', '神将' ],
	'九曜激昂':		[ '槍撃 修羅', '馬陣の極み', '騎突 金剛', '剛勇無双', '神将' ],
	'鷹視狼歩':		[ '槍撃 修羅', '馬陣の極み', '騎突 金剛', '剛勇無双', '神将' ],
	'天真蘭丸':		[ '騎突 金剛', '弓陣の極み', '弓撃 夜叉', '背水之陣', '剣豪将軍' ],
	'車懸り 白狐':	[ '車懸り', '馬陣の極み', '騎突 金剛', '車懸り 白狐', '神将' ],
	'戦華白虎':		[ '車懸り', '馬陣の極み', '騎突 金剛', '車懸り 白狐', '神将' ],
	'手負い獅子':	[ '車懸り', '馬陣の極み', '騎突 金剛', '車懸り 白狐', '神将' ],
	'五山無双':		[ '天賦の神算', '車懸り 白狐', '騎突 金剛', '槍撃 修羅', '神速' ],
	'滅覇渾身':		[ '槍陣の極み', '車懸り 白狐', '天賦の神算', '疾風怒濤', '神速' ],
	'軍神強襲':		[ '車懸り', '馬陣の極み', '騎突 金剛', '車懸り 白狐', '神将' ],
	'鬼神轟雷':		[ '騎馬隊剛撃', '馬陣の極み', '弓撃 夜叉', '剛勇無双', '剛勇無双' ],
	'鬼謀 国砕':	[ '城崩 奈落', '槍陣の極み', '砲撃 羅刹', '鬼謀 国砕', '神算鬼謀' ],
	'赤誠奮迅':		[ '城崩 奈落', '槍陣の極み', '砲撃 羅刹', '鬼謀 国砕', '神算鬼謀' ],
	'猛虎咆哮':		[ '天賦の神算', '疾風怒濤', '騎突 金剛', '神算鬼謀', '神速' ],
	'般若強襲':		[ '天賦の神算', '疾風怒濤', '騎突 金剛', '神算鬼謀', '神速' ],
	'滅 九頭龍':	[ '城崩 奈落', '車懸り 白狐', '騎突 金剛', '', '' ],
	'鉄砲術明光':	[ '弓撃 夜叉', '城崩 奈落', '車懸り 白狐', '砲撃 羅刹', '神速' ],
	'船団爆雷':		[ '砲撃 羅刹', '砲陣の極み', '弓撃 夜叉', '神速', '鬼謀 国砕' ],
	'風林火山 戦':	[ '槍撃 修羅', '車懸り', '騎突 金剛', '風林火山', '神速' ],
	'龍祖昇躍':		[ '天賦の神算', '騎突 金剛', '弓撃 夜叉', '', '' ],
	'神算鬼謀':		[ '', '', '', '神算鬼謀', '' ],
	'神将':			[ '', '', '', '神将', '' ],
	'独眼竜':		[ '', '', '', '独眼竜', '' ],
	'独眼竜咆哮':	[ '砲撃 羅刹', '騎突 金剛', '鬼謀 国砕', '独眼竜', '捨て奸' ],
	'太虚国崩し':	[ '組撃ち', '剣聖', '轟音 無鹿', '神算鬼謀 滅', '騎神' ],
	'謀神':			[ '天賦の神算', '神算鬼謀', '背水之陣', '騎神', '神算鬼謀 滅' ],
	'驍将奇略':		[ '神速', '神算鬼謀', '攻城の妙技', '騎神', '神算鬼謀 滅' ],
	'猿夜叉':		[ '弓撃 夜叉', '独眼竜', '捨て奸', '天衣無縫陣', '破軍星' ],
	'姫鬼戦舞':		[ '釣り野伏 鬼', '捨て奸', '姫鬼無双', '天衣無縫陣', '神算鬼謀 滅' ],
	'三河魂':		[ '剛勇無双', '剣聖', '背水之陣', '天衣無縫陣', '破軍星' ],
	'風林火山':		[ '騎突 金剛', '神将', '神速', '神算鬼謀 滅', '騎神' ],
	'覇道 不如帰':	[ '神速', '神算鬼謀', '釣り野伏 鬼', '騎神', '神算鬼謀 滅' ],
	'忠勇義烈':		[ '神将', '独眼竜', '車懸り 白狐', '謀神', '破軍星' ],
	'無双獅子':		[ '疾風怒濤', '攻城の妙技', '獅子の陣', '天衣無縫陣', '神算鬼謀 滅' ],
	'浅井一文字':	[ '疾風怒濤', '攻城の妙技', '猿夜叉', '天衣無縫陣', '神算鬼謀 滅' ],
	'神算鬼謀 滅':	[ '', '', '', '神算鬼謀 滅', '' ],
	'破軍星':		[ '', '', '', '破軍星', '' ],

//.. 複合防
	'槍衾':			[ '槍衾', '槍隊剛撃', '槍隊円陣', '義兵進軍', '槍陣の極み' ],
	'千樹挟撃陣':	[ '鉄砲隊円陣', '車懸り', '疾風迅雷', '火竜の術', '騎馬隊円陣' ],
	'矢雨備え':		[ '矢雨備え', '弓隊剛撃', '弓隊円陣', '三段撃 神速', '弓陣の極み' ],
	'釣瓶撃ち':		[ '釣瓶撃ち', '鉄砲隊剛撃', '鉄砲隊円陣', '弾幕防壁陣', '砲陣の極み' ],
	'八咫の構え':	[ '釣瓶撃ち', '鉄砲隊剛撃', '鉄砲隊円陣', '弾幕防壁陣', '砲陣の極み' ],
	'鉄甲陣':		[ '槍隊円陣', '槍隊剛撃', '騎馬隊円陣', '足軽軍法', '槍陣の極み' ],
	'七槍の極':		[ '槍隊円陣', '弓隊円陣', '槍隊剛撃', '剛勇無双', '義兵進軍' ],
	'七槍の匠':		[ '槍隊円陣', '騎馬隊円陣', '槍隊剛撃', '三段撃 烈火', '義兵進軍' ],
	'弓馬構え':		[ '弓馬構え', '騎馬隊剛撃', '弓隊剛撃', '足軽軍法', '弓陣の極み' ],
	'弓陣 下り藤':	[ '弓馬構え', '騎馬隊剛撃', '弓隊剛撃', '足軽軍法', '弓陣の極み' ],
	'日置流':		[ '弓馬構え', '騎馬隊剛撃', '弓隊剛撃', '足軽軍法', '弓陣の極み' ],
	'真田丸':		[ '真田丸', '鬼刺', '鉄壁の備え', '義兵進軍', '城崩 奈落' ],
	'霧雨の念':		[ '矢雨備え', '鬼刺', '鉄砲隊剛撃', '義兵進軍', '城崩 奈落' ],
	'七槍の義':		[ '槍隊円陣', '鉄砲隊円陣', '槍隊剛撃', '三段撃 神速', '義兵進軍' ],
	'日本一の兵':	[ '真田丸', '鬼刺', '鉄壁の備え', '義兵進軍', '城崩 奈落' ],
	'土壁の術':		[ '土壁の術', '火竜の術', '電光石火', '矢雨備え', '疾風迅雷' ],
	'弾幕防壁陣':	[ '弾幕防壁陣', '槍弓猛襲', '真田丸', '鉄壁の備え', '砲陣の極み' ],
	'祈祷の極み':	[ '鉄砲隊円陣', '砲撃 羅刹', '組撃ち', '八咫烏', '八咫烏' ],
	'組撃ち':		[ '', '', '', '八咫烏', '' ],
	'聖なる祈り':	[ '弾幕防壁陣', '車懸り', '砲陣の極み', '八咫烏', '八咫烏' ],
	'火縄剛撃陣':	[ '砲撃 羅刹', '砲陣の極み', '疾風迅雷', '', '' ],
	'戦陣 千鳥':	[ '弓陣の極み', '弓撃 夜叉', '槍陣の極み', '戦陣 千鳥', '背水之陣' ],
	'猛虎吼陣':		[ '弓陣の極み', '弓撃 夜叉', '槍陣の極み', '戦陣 千鳥', '背水之陣' ],
	'騎射 狭間矢':	[ '弓陣の極み', '弓撃 夜叉', '槍陣の極み', '戦陣 千鳥', '背水之陣' ],
	'八咫烏':		[ '組撃ち', '砲撃 羅刹', '砲陣の極み', '八咫烏', '捨て奸' ],
	'謀計奇策':		[ '砲陣の極み', '砲撃 羅刹', '組撃ち', '八咫烏', '捨て奸' ],
	'砲陣 菖蒲':	[ '組撃ち', '砲撃 羅刹', '砲陣の極み', '八咫烏', '捨て奸' ],
	'燕返し':		[ '槍陣の極み', '騎突 金剛', '弓撃 夜叉', '柳生新陰流', '剣聖' ],
	'弓妖陣':		[ '鉄壁の備え', '車懸り 白狐', '八咫烏', '背水之陣', '' ],
	'捨て奸':		[ '', '', '', '捨て奸', '' ],
	'君臣豊楽':		[ '砲陣の極み', '弾幕防壁陣', '釣り野伏 鬼', '捨て奸', '独眼竜' ],
	'背水之陣':		[ '', '', '', '背水之陣', '' ],
	'戦國下剋上':	[ '鉄壁の備え', '組撃ち', '車懸り 白狐', '背水之陣', '' ],
	'神勅賢母':		[ '鉄壁の備え', '車懸り 白狐', '八咫烏', '背水之陣', '神速' ],
	'謀将掌握':		[ '鬼謀 国砕', '独眼竜', '謀神', '破軍星', '天衣無縫陣' ],
	'獅子の陣':		[ '槍陣の極み', '背水之陣', '神算鬼謀', '騎神', '天衣無縫陣' ],
	'天下の采配':	[ '疾風怒濤', '背水之陣', '攻城の妙技', '神算鬼謀 滅', '天衣無縫陣' ],
	'独眼竜轟雷':	[ '組撃ち', '神将', '独眼竜咆哮', '破軍星', '神算鬼謀 滅' ],

//.. 全
	'刹那の猛勇':	[ '刹那の猛勇', '鉄壁の備え', '槍隊剛撃', '義兵進軍', '槍陣の極み' ],
	'華蝶風月':		[ '槍隊剛撃', '槍隊円陣', '騎馬隊剛撃', '足軽軍法', '槍撃 修羅' ],
	'天賦の神算':	[ '城崩 奈落', '弓陣の極み', '弓撃 夜叉', '天賦の神算', '神算鬼謀' ],
	'滅殺陣弦月':	[ '城崩 奈落', '弓陣の極み', '弓撃 夜叉', '天賦の神算', '' ],
	'車懸り':		[ '', '', '', '車懸り 白狐', '' ],
	'武辺者見参':	[ '刹那の猛勇', '騎突 金剛', '砲陣の極み', '車懸り', '' ],
	'車懸り 軍神':	[ '車懸り', '神速', '神将', '破軍星', '騎神' ],
	'天魔封縛陣':	[ '車懸り 白狐', '神算鬼謀', '将軍の勅命', '破軍星', '天衣無縫陣' ],
	'太閤の威光':	[ '天賦の神算', '神速', '天下の采配', '天衣無縫陣', '破軍星' ],

	'鉄壁の備え':	[ '鉄壁の備え', '刹那の猛勇', '真田丸', '城崩し', '組撃ち' ],
	'三河堅陣':		[ '鉄壁の備え', '刹那の猛勇', '真田丸', '城崩し', '組撃ち' ],
	'八龍堅陣':		[ '弓隊円陣', '弓撃 夜叉', '車懸り', '疾風怒濤', '背水之陣' ],
	'唐獅子陣':		[ '槍陣の極み', '弓陣の極み', '馬陣の極み', '砲陣の極み', '' ],
	'将軍の勅命':	[ '疾風怒濤', '背水之陣', '攻城の妙技', '神算鬼謀 滅', '天衣無縫陣' ],
	'神謀鬼略':		[ '捨て奸', '天賦の神算', '鬼謀 国砕', '破軍星', '天衣無縫陣' ],
	'覇王 葵巴':	[ '八咫烏', '神速', '三河魂', '破軍星', '天衣無縫陣' ],
	'猛勇黒天狐':	[ '剛勇無双', '神将', '驍将奇略', '騎神', '破軍星' ],
	'天衣無縫陣':	[ '', '', '', '天衣無縫陣', '' ],

//.. 武将
	'剣術 攻乃型':	[ '剣術 攻乃型', '槍隊挟撃', '剣術 守乃型', '迅速行軍', '神行法' ],
	'新陰流':		[ '新陰流', '宝蔵院流', '電光石火', '大ふへん者', '槍撃 修羅' ],
	'草薙流':		[ '新陰流', '宝蔵院流', '電光石火', '大ふへん者', '槍撃 修羅' ],
	'虚空一閃':		[ '新陰流', '宝蔵院流', '電光石火', '大ふへん者', '槍撃 修羅' ],
	'鎖旋風':		[ '槍隊円陣', '鬼刺', '足軽軍法', '疾風怒濤', '神速' ],
	'大ふへん者':	[ '大ふへん者', '宝蔵院流', '鬼刺', '義兵進軍', '槍撃 修羅' ],
	'傾奇御免':		[ '大ふへん者', '宝蔵院流', '鬼刺', '義兵進軍', '槍撃 修羅' ],
	'剣豪将軍':		[ '槍撃 修羅', '槍陣の極み', '城崩 奈落', '剣豪将軍', '剣聖' ],
	'新陰流逆風':	[ '槍撃 修羅', '槍陣の極み', '城崩 奈落', '剣豪将軍', '剣聖' ],
	'二天一流':		[ '槍撃 修羅', '槍陣の極み', '城崩 奈落', '剣豪将軍', '剣聖' ],
	'剣聖':			[ '', '', '', '剣聖', '' ],

	'剣術 守乃型':	[ '剣術 守乃型', '槍隊守護', '剣術 攻乃型', '迅速行軍', '神行法' ],
	'宝蔵院流':		[ '宝蔵院流', '新陰流', '土壁の術', '鬼刺', '槍陣の極み' ],
	'柳生新陰流':	[ '槍陣の極み', '騎突 金剛', '弓撃 夜叉', '柳生新陰流', '剣聖' ],

//.. 速度
	'迅速行軍':		[ '迅速行軍', '鉄砲隊布陣', '騎馬隊突撃', '弓隊突撃', '神行法' ],
	'兵器運用術':	[ '兵器運用術', '兵器布陣', '槍隊突撃', '兵器突撃', '火竜の術' ],
	'神行法':		[ '神行法', '土壁の術', '電光石火', '謀殺', '電光石火' ],
	'疾風迅雷':		[ '', '', '', '義兵進軍', '' ],
	'電光石火':		[ '電光石火', '火竜の術', '騎馬隊円陣', '啄木鳥', '疾風迅雷' ],
	'桜花乱舞':		[ '電光石火', '火竜の術', '騎馬隊円陣', '啄木鳥', '疾風迅雷' ],
	'義兵進軍':		[ '義兵進軍', '釣瓶撃ち', '電光石火', '大ふへん者', '騎突 金剛' ],
	'颯空術':		[ '電光石火', '謀殺', '騎馬隊円陣', '真田丸', '疾風迅雷' ],
	'戦陣艶舞':		[ '疾風迅雷', '槍陣の極み', '槍撃 修羅', '疾風怒濤', '' ],
	'疾風太秦':		[ '義兵進軍', '釣瓶撃ち', '電光石火', '大ふへん者', '騎突 金剛' ],
	'武神襲来':		[ '弓隊突撃', '槍隊奇襲', '騎馬隊布陣', '槍隊剛撃', '車懸り' ],
	'直江状':		[ '義兵進軍', '釣瓶撃ち', '電光石火', '大ふへん者', '騎突 金剛' ],
	'神行法 千里':	[ '義兵進軍', '釣瓶撃ち', '電光石火', '大ふへん者', '騎突 金剛' ],
	'疾風怒濤':		[ '車懸り', '砲陣の極み', '砲撃 羅刹', '疾風怒濤', '神速' ],
	'神風襲来':		[ '車懸り', '砲陣の極み', '砲撃 羅刹', '疾風怒濤', '神速' ],
	'歌舞伎乱舞':	[ '車懸り', '馬陣の極み', '桜花乱舞', '疾風怒濤', '神速' ],
	'鳶之一翼':		[ '城崩 奈落', '砲撃 羅刹', '車懸り', '神速', '天賦の神算' ],
	'神速':			[ '', '', '', '神速', '' ],
	'歌舞伎蝶':		[ '車懸り', '馬陣の極み', '桜花乱舞', '', '' ],
	'進撃縮地':		[ '疾風怒濤', '車懸り', '天賦の神算', '神速', '剣聖' ],
	'近江の軍神':	[ '疾風怒濤', '槍撃 修羅', '戦陣 千鳥', '神将', '攻城の妙技' ],
	'騎神':			[ '', '', '', '騎神', '' ],
	'風林火山 颯':	[ '天賦の神算', '背水之陣', '風林火山', '騎神', '破軍星' ],
	'車懸り 焔渦':	[ '天賦の神算', '背水之陣', '車懸り 軍神', '騎神', '破軍星' ],

//.. 特殊
	'謀殺':			[ '謀殺', '神行法', '火竜の術', '鉄壁の備え', '疾風迅雷' ],
	'封技閃影':		[ '三段撃 烈火', '車懸り', '火竜の術', '八咫烏', '車懸り 白狐' ],
	'妙計暗躍':		[ '鬼謀 国砕', '謀計奇策', '背水之陣', '天賦の神算', '' ],
	'攻城の妙技':	[ '', '', '', '攻城の妙技', '' ],
	'外法鳶陰':		[ '槍隊剛撃', '車懸り', '砲撃 羅刹', '車懸り 白狐', '神速' ],
	'天下の義賊':	[ '城崩 奈落', '砲陣の極み', '砲撃 羅刹', '疾風怒濤', '独眼竜' ],
	'一期一会':		[ '車懸り 白狐', '疾風怒濤', '剛勇無双', '神速', '神算鬼謀' ],
	'天の福音':		[ '矢雨備え', '天賦の神算', '疾風怒濤', '義兵進軍', '神速' ],
	'神童覚醒':		[ '砲陣の極み', '砲撃 羅刹', '疾風怒濤', '鬼謀 国砕', '' ],
	'真言念破':		[ '驍将奇略', '獅子の陣', '神速', '攻城の妙技', '疾風怒濤' ]
}

};

//■■■■■■■■■■■■■■■■■■■

//■ Map
var Map = {

//. info
info: {},

//. baseList
baseList: [],

//. analyzedData
analyzedData: [],

//. init
init: function() {
	Map.info = Map.mapInfo();

	if ( Map.info.isBattleMap ) {
		Map.baseList = Util.getBaseList( Map.info.country );
	}
},

//. setup
setup: function() {
	Map.analyze();
	Map.npcPower();
	Map.coordList( Map.info.country );

	$('#mapOverlayMap > AREA').contextMenu( Map.contextmenu, true );
	$('#imi_base_list TR').contextMenu( Map.contextmenu, true );

	$('#imi_base_list, #imi_coord_list')
	.on('mouseenter', 'TR', Map.enterRow )
	.on('mouseleave', 'TR', Map.leaveRow );

	$(window).on('popstate', function() {
		Map.moveUrl( location.href );
	});
},

//. mapInfo
mapInfo: function() {
	var info = { country: '', isBattleMap: false };

	var maphref = $('#ig_map_movepanel UL A').first().attr('href');
	if ( maphref ) {
		//マップの中心座標 'mapx' 'mapy'
		var mappoint = maphref.match(/x=(-?\d+)&y=(-?\d+)/);
		info.x = mappoint[1].toInt();
		info.y = mappoint[2].toInt();

		//マップ表示国 'country'
		var country = maphref.match(/c=(\d+)/);
		if ( country ) {
			info.country = country[1].toInt();
		}

		//マップ表示タイル数 'size'
		var tile = $('#ig_mapsAll').children('IMG').length;
		if ( tile >= 400 ) {
			info.size = 20;
		}
		else if ( tile >= 225 ) {
			info.size = 15;
		}
		else {
			info.size = 11;
		}
	}

	if ( info.country == 20 || info.country == 21 ) {
		info.isBattleMap = true;
	}

	return info;
},

//. analyze
analyze: function() {
	var $img_list = $('#ig_mapsAll').children('IMG'),
		$area_list = $('#mapOverlayMap').children('AREA'),
		img_list;

	img_list = Map.analyzeImg( $img_list );
	Map.analyzeArea( $area_list, img_list );
	Map.analyzeReport();
},

//. analyzeImg
analyzeImg: function( $img_list ) {
	var img_list = [];

	//マップ解析
	$img_list.each(function() {
		var $this = $(this),
			png = $this.attr('src').split('/').pop(),
			classname = $this.attr('class'),
			type, discriminant, scale;

		if ( png == null ) { return; }
		//overlay用画像
		if ( png == 'x.gif' ) { return; }
		if ( png == 'panel_rollover2.png' ) { return; }
		//外周チェック
		if ( png == 'outside.png' ) { return; }

		png = png.replace('.png', '').split('_');
		type = '';
		discriminant = '-';
		scale = '-';

		switch( png[0] ) {
			case 'fall'      : type = '陥落'; png.shift(); break;
			case 'capital'   : type = '城'; break;
			case 'fort'      : type = '砦'; break;
			case 'village'   : type = '村'; break;
			case 'stronghold': type = '出城'; break;
			case 'camp'      : type = '陣'; break;
			case 'territory' : type = '領地'; break;
			case 'reclaimed' : type = '開拓地'; break;
			case 'field'     : type = '空き地'; break;
		}

		if ( type == '出城' || type == '陣' ) {
			scale = png[2].toUpperCase();
		}

		switch( png[1] ) {
			case 'b' : discriminant = '自分'; break;
			case 'ga': discriminant = '同盟'; break;
			case 'g' : discriminant = '味方'; break;
			case 'r' : discriminant = '敵'; break;
			case 'p' : discriminant = 'NPC'; break;
		}

		img_list.push({ img: $this, type: type, discriminant: discriminant, scale: scale, class: classname });
	});

	return img_list;
},

//. analyzeArea
analyzeArea: function( $area_list, img_list ) {
	var source_reg = /'.*?'/g,
		search_reg = /map\.php\?x=(-?\d+)&y=(-?\d+)&c=(\d+)/,
		storage = MetaStorage('USER_FALL'),
		list = [];

	$area_list.each(function( idx ) {
		var $this    = $(this),
			source   = ( $this.attr('onMouseOver') || '' ).split('; overOperation')[ 0 ],
			array    = source.match( source_reg ),
			source2  = $this.attr('onClick') || '',
			array2   = source2.match( source_reg ),
			search   = array2[ 2 ].match( search_reg ) || [],
			img_data = img_list[ idx ],
			data     = { idx: idx };

		if ( !img_data ) { return; }

		array.forEach(function( value, idx, ary ) {
			ary[ idx ] = value.replace(/'/g, '');
		});

		//通常マップと新合戦場でパラメータ数が違う
		//0:城名 1:城主名 2:人口 3:座標 4:同盟名 5:価値 6:距離 7:木 8:綿 9:鉄 10:糧 11:池 12:NPCフラグ 13:画像
		//0:城名 1:城主名 2:座標 3:同盟名 4:価値 5:距離 6:槍補正 7:弓補正 8:馬補正 9:器補正 10:木 11:綿 12:鉄 13:糧 14:池 15:NPCフラグ 16:画像
		if ( Map.info.country == 20 || Map.info.country == 21 ) {
			array.splice( 6, 4 );
			array.splice( 2, 0, '-');
		}

		data.castle     = ( array[0] != '　' ) ? array[0] : '';
		data.user       = ( array[1] != '　' ) ? array[1].replace(/\(Lv[\d-]+\)$/, '') : '';
		data.population = ( array[2] != '　' ) ? array[2] : '-';
		data.point      = array[3].replace(/[\(\)]/g, '');
		data.alliance   = ( array[4] != '　' ) ? array[4] : '';
		data.distance   = array[6];
		data.npc        = array[ array.length - 2 ];

		if ( img_data.type == '空き地' ) {
			//ソートさせる為、同盟に価値、ユーザーに資源をセット
			data.alliance  = array[5];
			data.user      = array.slice( 7, 12 ).join('/');
			data.materials = array.slice( 7, 12 ).join('');
			//NPC扱いとする
			data.npc  = 1;
			//価値をセットしフィルタ条件で使用する
			data.rank = array[5].length;
		}
		else if ( img_data.type == '領地' ) {
			//資源情報をセットし必要攻撃力を表示させる
			data.materials = array.slice( 7, 12 ).join('');
			//価値をセットしフィルタ条件で使用する
			data.rank = array[5].length;
		}

		data.id      = 'imi_area_' + search[1] + '_' + search[2];
		data.x       = search[1];
		data.y       = search[2];
		data.country = search[3];
		data.type    = img_data.type;
		data.discriminant = img_data.discriminant;
		data.scale   = img_data.scale;
		data.class   = img_data.class;

		if ( data.discriminant == '自分' ) {
			data.userId = undefined;
			data.alliId = ( $('.gMenu07 > A').attr('href').match(/\d+/) || [] )[ 0 ];
		}
		else {
			data.userId = ( array2[ 3 ].match(/\d+/) || [] )[ 0 ];
			data.alliId = ( array2[ 5 ].match(/\d+/) || [] )[ 0 ];
		}

		$this.attr({ id: data.id, idx: idx });

		data.stronghold_area = false;
		if ( !Map.info.isBattleMap && img_data.type == '空き地' ) {
			//空き地の場合、出城エリア判定
			var x = Math.abs( parseInt( data.x, 10 ) ),
				y = Math.abs( parseInt( data.y, 10 ) ),
				fortresses = Data.fortresses,
				len = fortresses.length;

			for ( var i = 1; i < len; i++ ) {
				//出城エリア判定
				if ( !( fortresses[ i ][ 0 ] - 3 <= x && x <= fortresses[ i ][ 0 ] + 3 ) ) { continue; }
				if ( !( fortresses[ i ][ 1 ] - 3 <= y && y <= fortresses[ i ][ 1 ] + 3 ) ) { continue; }

				img_data.img.attr( 'src', Data.images.buffer_zone );

				data.stronghold_area = true;
				break;
			}
		}

		if ( data.discriminant == '敵' && data.type == '城' ) {
			storage.set( data.userId, false );
		}

		list.push( data );
	});

	for ( var i = 0; i < list.length; i++ ) {
		let data = list[ i ];

		if ( data.discriminant == '敵' && $.inArray( data.type, [ '城', '村', '砦' ] ) != -1 ) {
			data.fallmain = storage.get( data.userId );

			if ( data.fallmain === true && ( data.type == '村' || data.type == '砦' ) ) {
				let $img = $( '.' + data.class ).not('.imc_mark');

				$img.attr('defaultsrc', $img.attr('src') )
				.attr('src', Env.externalFilePath + '/img/panel/fall_capital_r_l.png');
			}
		}
	}

	Map.analyzedData = list;
},

//. analyzeReport
analyzeReport: function() {
	var $tbody  = $('#imi_base_list'),
		$table  = $('#imi_base_conditions'),
		discriminant = $table.find('INPUT[name="imn_discriminant"]:checked').val(),
		alliance = $table.find('INPUT[name="imn_alliance"]').val(),
		rank = $table.find('SELECT[name="imn_rank"]').val().toInt(),
		type = '';

	$table.find('INPUT[name="imn_type"]').filter(':checked').each(function() { type += $(this).val(); });

	MetaStorage('SETTINGS').set('mapinfo', { type: type, discriminant: discriminant, alliance: alliance, rank: rank });

	var list = Map.analyzedData.filter(function( value ) {
		//出城エリアは非表示
		if ( value.stronghold_area ) { return false; }
		//条件にあてはまるものを表示
		if ( discriminant != '' && discriminant.indexOf('|' + value.discriminant + '|') == -1 ) { return false; }
		if ( alliance != '' && alliance != value.alliance ) { return false; }
		if ( type == '' ) {
			return true;
		}
		else if ( type.indexOf('|' + value.type + '|') == -1 ) {
			return false;
		}
		else if ( value.type == '領地' || value.type == '空き地' ) {
			//領地・空き地の場合、価値によるフィルタを行う
			if ( rank == 0 ) { return true; }
			if ( rank <= 5 && value.rank > rank ) { return false; }
			if ( rank >= 6 && value.rank < rank ) { return false; }
		}

		return true;
	});

	//表示の中心からの距離
	list.forEach(function( value ) {
		value.showDist = Util.getDistance( Map.info, value.point );
	});

	//同盟+城主名でソート
	list.sort(function( a, b ) {
		return ( a.alliance + a.user > b.alliance + b.user )
			|| ( a.alliance + a.user == b.alliance + b.user && a.showDist > b.showDist );
	})

	var html = list.map(function( obj ) {
		//表示の中心からの距離
		var color;

		switch ( obj.discriminant ) {
			case '敵': color = '#f99'; break;
			case '味方': color = '#9f9'; break;
			case '同盟': color = '#9cf'; break;
			case '自分': color = '#ddd'; break;
			default: color = 'transparent'; break;
		}

		return '<tr style="cursor: pointer;" idx="' + obj.idx + '" areaid="' + obj.id + '">' +
			'<td>' + obj.alliance + '</td>' +
			'<td>' + obj.user + '</td>' +
			'<td>' + obj.castle + '</td>' +
			'<td>' + obj.type + ( ( obj.fallmain === true ) ? '×' : ( obj.fallmain === false ) ? '○' : '' ) + '</td>' +
			'<td>' + obj.scale + '</td>' +
			'<td style="background-color: ' + color + '">' + obj.discriminant + '</td>' +
			'<td>' + obj.population + '</td>' +
			'<td>' + obj.point + '</td>' +
			'<td>' + obj.showDist.toRound( 2 ) + '</td>' +
		'</tr>';
	}).join('');

	$tbody.empty().append( html );
},

//. coordRegister
coordRegister: function( x, y, country, data ) {
	var coord = x + ',' + y;

	country = country || Map.info.country || '';

	MetaStorage('COORD.' + country).set( coord, data );
},

//. coordUnregister
coordUnregister: function( x, y, country ) {
	var coord = x + ',' + y;

	country = country || Map.info.country || '';

	MetaStorage('COORD.' + country).remove( coord )
},

//. coordList
coordList: function( country ) {
	var list = MetaStorage('COORD.' + country).data,
		$tbody = $('#imi_coord_list').empty();

	$.each(list, function( coordinates ) {
		var point = coordinates.match(/(-?\d+),(-?\d+)/);
		if ( !point ) { return; }

		$tbody
		.append(
			$('<tr style="cursor: pointer;" />').data({ user: this.user, castle: this.castle, x: point[1], y: point[2] })
			.append(
				'<td>' + ( this.user || '-' ) + '</td>' +
				'<td>' + ( this.castle || '-' ) + '</td>' +
				'<td>' + ( coordinates ) + '</td>' +
				'<td>' + ( this.type || '-' ) + '</td>'
			)
		)
	});

	$tbody.find('tr')
	.click(function() {
		var { x, y } = $(this).data();
		Map.move( x, y );
	})
	.contextMenu(function() {
		//user情報には資源情報が入っている場合があるためplayer判定には使えない
		var $this = $(this),
			{ user, castle, x, y } = $this.data(),
			type = $this.find('TD').eq( 3 ).text(),
			title = ( castle || type + ' (' + x + ',' + y + ')' ),
			menu = {};

		menu[ title ] = $.contextMenu.title;

		menu['ここを中心に表示'] = function() { Map.move( x, y ); };
		menu['ここへ部隊出陣'] = function() { Map.send( x, y ); };

		if ( castle != '' ) {
			menu['セパレーター1'] = $.contextMenu.separator;
			menu['合戦報告書'] = function() { Map.contextmenu.warList( user ); };
			menu['格付'] = function() { Map.contextmenu.ranking( user ); };
			menu['一戦撃破・防衛'] = function() { Map.contextmenu.score( user ); };
		}

		menu['セパレーター2'] = $.contextMenu.separator;
		menu['座標削除'] = function() {
			Map.coordUnregister( x, y, country );
			Map.coordList( country );
		};

		return menu;
	});

	//登録座標表示
	Map.showCoord( country );
	Map.showMark();
},

//. showCountryMap
showCountryMap: function( country ) {
	var list = BaseList.all( country );

	CounteryMap.create( country, {
		pxsize: 0.5,
		pointsize: 2,
		fortresssize: 1,
		label: false,
		fortress: !Map.info.isBattleMap
	}).appendTo('#imi_map');
	CounteryMap.showBasePoint( 'user', list );
	CounteryMap.showViewArea( Map.info );

	if ( Map.info.isBattleMap ) {
		list = Map.baseList;
		CounteryMap.showBasePoint( 'fortress', list );
	}

	//登録座標表示
	Map.showCoord( country );
},

//. showCoord
showCoord: function( country ) {
	var coord = MetaStorage('COORD.' + country).data,
		coordList;

	coordList = $.map( coord, function( value, key ) {
		var array = key.split(',');

		return { x: array[0].toInt(), y: array[1].toInt(), color: '#ff0' };
	});

	CounteryMap.showBasePoint( 'coord', coordList );
},

//. showMark
showMark: function() {
	var country = Map.info.country,
		images = Data.images,
		$map = $('#ig_mapsAll'),
		list = MetaStorage('UNIT_STATUS').get('部隊') || [],
		enemy = MetaStorage('UNIT_STATUS').get('敵襲') || [],
		coord = MetaStorage('COORD.' + country).data,
		movecolors = {
			'攻撃': '#39f', '陣張': '#39f', '合流': '#39f', '加勢': '#39f',
			'帰還': '#3f9', '開拓': '#063', '敵襲': '#f66'
		},
		movelist = [];

	$map.find('.imc_mark').remove();

	for ( var i = 0, len = list.length; i < len; i++ ) {
		var { sx, sy, ex, ey, ec, mode } = list[ i ];

		if ( ec != Map.info.country ) { continue; }

		mark( ex, ey, mode );

		//ミニマップに移動線を表示するデータ
		if ( movecolors[ mode ] ) {
			movelist.push({ sx: sx, sy: sy, ex: ex, ey: ey, color: movecolors[ mode ] });
		}
	}

	for ( var i = 0, len = enemy.length; i < len; i++ ) {
		var { sx, sy, ex, ey, ec } = enemy[ i ];

		if ( ec != Map.info.country ) { return; }

		mark( sx, sy, '敵襲' );
		mark( ex, ey, '出撃' );

		//ミニマップに移動線を表示するデータ
		movelist.push({ sx: sx, sy: sy, ex: ex, ey: ey, color: movecolors[ '敵襲' ] });
	};

	CounteryMap.showRoute( movelist );

	function mark( x, y, mode ) {
		var id = 'imi_area_' + x + '_' + y,
			$area = $('#' + id);

		if ( $area.length == 0 ) { return; }

		var idx = $area.attr('idx'),
			data = Map.analyzedData[ idx ];

		var $img = $('<IMG class="imc_mark"/>').addClass( data.class );

		if ( mode == '攻撃' ) {
			$img.attr('src', images.panel_icon_attack);
		}
		else if ( mode == '陣張' ) {
			$img.attr('src', images.panel_icon_camp);
		}
		else if ( mode == '合流' ) {
			$img.attr('src', images.panel_icon_meeting);
		}
		else if ( mode == '加勢' ) {
			$img.attr('src', images.panel_icon_backup);
		}
		else if ( mode == '開拓' ) {
			$img.attr('src', images.panel_icon_develop);
		}
		else if ( mode == '帰還' ) {
			$img.attr('src', images.panel_icon_return);
		}
		else if ( mode == '待機' ) {
			$img.attr('src', images.panel_icon_wait);
		}
		else if ( mode == '加待' ) {
			$img.attr('src', images.panel_icon_backup_wait);
		}
		else if ( mode == '国移' ) {
			$img.attr('src', images.panel_icon_move);
		}
		else if ( mode == '出撃' ) {
			$img.attr('src', images.panel_icon_enemy);
		}
		else if ( mode == '敵襲' ) {
			$img.attr('src', images.panel_icon_sortie);
		}

		$map.append( $img );
	}

	$.each( coord, function( key ) {
		var id = 'imi_area_' + key.replace(',', '_'),
			$area = $('#' + id),
			idx, data, $img

		if ( $area.length == 0 ) { return; }

		idx = $area.attr('idx');
		data = Map.analyzedData[ idx ];
		$img = $('<IMG class="imc_mark"/>').attr('src', images.panel_icon_bmcoord).addClass( data.class );

		$map.append( $img );
	});
},

//. move
move: function( x, y, country ) {
	if ( x === '' || x === undefined || y === '' || y === undefined ) {
		throw new Error( 'x: ' + x + ' y: ' + y + ' 座標情報が不正です。' );
	}
	country = country || '';

	if ( Env.ajax ) { return; }

	var url = '/map.php?x=' + x + '&y=' + y;

	if ( Map.info.country && ( country == Map.info.country || country == '' ) ) {
		//地図画面＆同国内移動
		url += '&c=' + Map.info.country;

		Map.moveUrl( url ).done(function() {
			history.pushState( null, null, url );
		});
	}
	else {
		//地図画面以外、または他国移動
		if ( country ) { url += '&c=' + country; }

		location.href = url;
	}
},

//. moveUrl
moveUrl: function( url ) {
	Env.ajax = true;

	return Page.get( url )
	.pipe(function( html ) {
		var $html = $(html);

		//各種置き換え
		$('#ig_mapbox_container').replaceWith( $html.find('#ig_mapbox_container') );
		$('#ig_map_movepanel UL').replaceWith( $html.find('#ig_map_movepanel UL') );

		//移動したので情報更新
		Map.info = Map.mapInfo();
		Map.analyze();
		Map.showCountryMap( Map.info.country );
		Map.showMark();
	})
	.always(function() {
		Env.ajax = false;
	});
},

//. send
send: function( x, y, country, village ) {
	var search = 'x=' + x + '&y=' + y,
		url;

	country = country || Map.info.country || '';
	if ( country ) { search += '&c=' + country; }

	url = '/facility/send_troop.php?' + search;

	if ( village ) {
		url = Util.getVillageChangeUrl( village.id, url );
	}

	location.href = url;
},

//. fightHistory
fightHistory: function( search ) {
	var country = Map.info.country;

	Page.get( '/war/fight_history.php?' + search )
	.pipe(function( html ) {
		var $html = $(html);

		$html
		.find('.ig_battle_table').find('TR').slice( 1 )
		.appendTo( $('#imi_situation_list').empty() )
		.each(function() {
			var $this = $(this),
				text  = $this.find('A:eq(2)').text(),
				point = text.match(/\((-?\d+),(-?\d+)\)/),
				area_id;

			if ( !point ) { return; }

			area_id = 'imi_area_' + point[1] + '_' + point[2];
			$this.attr({ areaid: area_id, x: point[1], y: point[2], country: country });
		})
		.hover( Map.enterRow, Map.leaveRow )
		.contextMenu(function() {
			var $this = $(this),
				user = $this.find('A:first').text(),
				castle = $this.find('A:eq(2)').text().replace(/\(.+\)/, ''),
				x = $this.attr('x'),
				y = $this.attr('y'),
				country = $this.attr('country'),
				menu = {};

			if ( user != '' ) {
				menu[ castle ] = $.contextMenu.title;
				menu['ここを中心に表示'] = function() { Map.move( x, y, country ); };
				menu['合戦報告書'] = function() { Map.contextmenu.warList( user ); };
			}

			return menu;
		});

		$('#imi_tab_container').find('LI[target="imi_situation"]').click();
	});
},

//. npcPower
npcPower: function() {
	$('#mapOverlayMap AREA')
	.live( 'mouseenter', Map.enterArea )
	.live( 'mouseleave', Map.leaveArea );
},

//. enterArea
enterArea: function() {
	var $this     = $(this),
		idx       = $this.attr('idx').toInt(),
		data      = Map.analyzedData[ idx ],
		distance  = data.distance,
		dist_mod  = Math.floor( 19 / (parseFloat( distance ) + 9) * 100 ),
		npcPower  = Util.getNpcPower( data.rank, data.materials ),
		min, minidx, str, attack_mod;

	dist_mod = (dist_mod > 100) ? 100 : dist_mod;

	if ( !npcPower ) { return; }

	min = Number.MAX_VALUE;
	minidx = 0;
	str = '';

	$.each( npcPower, function( i ) {
		if ( this < min ) {
			min = this;
			minidx = i;
		}
	});

	$.each(['槍', '弓', '馬', '器'], function( i ) {
		var attack;

		if ( i > 0 ) {
			str += '／';
		}

		attack = npcPower[ i ];
		if ( attack == min ) {
		   str += '<SPAN style="color: #C53B43">' + this + ' ' + attack.toFormatNumber() + '</SPAN>';
		}
		else {
		   str += this + ' ' + attack.toFormatNumber();
		}
	});

	if ( dist_mod < 100 ) {
		//距離による減衰あり
		attack_mod = Math.ceil( min / dist_mod * 100 );
		str += '　（距離減衰：' + (dist_mod - 100) + '%';
		str += '　攻撃力目安：<SPAN style="color: #C53B43">' + ['槍', '弓', '馬', '器'][ minidx ] + ' ' + attack_mod.toFormatNumber() + '</SPAN>）';
	}

	$('#imi_npc_attack').html( str );
},

//. leaveArea
leaveArea: function() {
	$('#imi_npc_attack').html( '' );
},

//. enterRow
enterRow: function() {
	var $this  = $(this),
		areaid = $this.attr('areaid'),
		x, y;

	if ( !areaid ) {
		x = $this.data('x');
		y = $this.data('y');
		areaid = 'imi_area_' + x + '_' + y;
	}

	$this.addClass('imc_current');
	$('#' + areaid).mouseover();
},

//. leaveRow
leaveRow: function() {
	var $this = $(this),
		areaid = $this.attr('areaid'),
		x, y;

	if ( !areaid ) {
		x = $this.data('x');
		y = $this.data('y');
		areaid = 'imi_area_' + x + '_' + y;
	}

	$this.removeClass('imc_current');
	$('#' + areaid).mouseout();
},

//. contextmenu
contextmenu: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ],
		coord = data.x + ',' + data.y,
		load  = $('#lordName').text(),
		title = ( data.castle || data.type + ' (' + coord + ')' ),
		enemy = $('#btn_enemysituation').length,
		menu  = {},
		submenu;

	menu[ title ] = $.contextMenu.title;
	menu['ここを中心に表示'] = Map.contextmenu.center;
	menu['ここへ部隊出陣'] = Map.contextmenu.send;

	if ( data.user != load ) {
		menu['最寄りの拠点'] = {
			'部隊作成【第一組】': function() { Map.contextmenu.createUnitNearby( data, 1 ); },
			'部隊作成【第二組】': function() { Map.contextmenu.createUnitNearby( data, 2 ); },
			'部隊作成【第三組】': function() { Map.contextmenu.createUnitNearby( data, 3 ); },
			'部隊作成【第四組】': function() { Map.contextmenu.createUnitNearby( data, 4 ); },
			'部隊作成【全武将】': function() { Map.contextmenu.createUnitNearby( data, 0 ); },
			'セパレーター': $.contextMenu.separator,
			'ここへ部隊出陣': Map.contextmenu.send2,
			'拠点選択': Map.contextmenu.nearbyVillage
		};
	}
	else if ( data.type == '領地' ) {
		menu['最寄りの拠点'] = {
			'部隊作成【第一組】': function() { Map.contextmenu.createUnitNearby( data, 1 ); },
			'部隊作成【第二組】': function() { Map.contextmenu.createUnitNearby( data, 2 ); },
			'部隊作成【第三組】': function() { Map.contextmenu.createUnitNearby( data, 3 ); },
			'部隊作成【第四組】': function() { Map.contextmenu.createUnitNearby( data, 4 ); },
			'部隊作成【全武将】': function() { Map.contextmenu.createUnitNearby( data, 0 ); },
			'セパレーター': $.contextMenu.separator,
			'ここへ部隊出陣': Map.contextmenu.send2,
			'拠点選択': Map.contextmenu.nearbyVillage
		};
		menu['この領地を陣にする'] = Map.contextmenu.toCamp;
	}
	else {
		menu['この拠点'] = {
			'部隊作成【第一組】': function() { Map.contextmenu.createUnit( data, 1 ); },
			'部隊作成【第二組】': function() { Map.contextmenu.createUnit( data, 2 ); },
			'部隊作成【第三組】': function() { Map.contextmenu.createUnit( data, 3 ); },
			'部隊作成【第四組】': function() { Map.contextmenu.createUnit( data, 4 ); },
			'部隊作成【全武将】': function() { Map.contextmenu.createUnit( data, 0 ); },
			'セパレーター': $.contextMenu.separator,
			'拠点選択': Map.contextmenu.changeVillage,
			'拠点名変更': Map.contextmenu.renameVillage
		};
	}

	if ( enemy > 0 ) {
		menu['周辺の敵襲'] = Map.contextmenu.fightHistoryAround;
	}

	menu['合戦報告書【座標】'] = function() { Map.contextmenu.warList( '', data.x, data.y ); };

	if ( data.user != '' && data.npc == '' ) {
		menu['セパレーター1'] = $.contextMenu.separator;

		menu['合戦報告書【城主】'] = function() { Map.contextmenu.warList( data.user ); };

		submenu = {};
		submenu['格付'] = function() { Map.contextmenu.ranking( data.user ); };
		submenu['一戦撃破・防衛'] = function() { Map.contextmenu.score( data.user ); };
		if ( data.discriminant == '敵' ) {
			submenu['本領陥落チェック'] = Map.contextmenu.checkFall;
		}
		submenu['セパレーター'] = $.contextMenu.separator;
		submenu['城主プロフィール'] = Map.contextmenu.userProfile;

		menu['城主情報'] = submenu;

		submenu = {};
		submenu['合戦報告書 【同盟】'] = function() { Map.contextmenu.warList( '', '', '', data.alliance ); };
		if ( enemy > 0 ) {
			submenu['敵襲状況'] = Map.contextmenu.fightHistoryAlliance;
		}
		submenu['セパレーター'] = $.contextMenu.separator,
		submenu['同盟情報'] = Map.contextmenu.alliancInfo

		menu['同盟情報'] = submenu;
	}

	menu['セパレーター2'] = $.contextMenu.separator;

	menu['情報のコピー'] = {
		'座標': function() { Map.contextmenu.coordInfo( 1, data ); },
		'拠点名＋座標': function() { Map.contextmenu.coordInfo( 2, data ); }
	};

	if ( MetaStorage( 'COORD.' + data.country ).get( coord ) ) {
		menu['座標削除'] = Map.contextmenu.coordUnregister;
	}
	else {
		menu['座標登録'] = Map.contextmenu.coordRegister;
	}

	return menu;
}

};

$.extend( Map.contextmenu, {

//.. center - ここを中心に表示
center: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ];

	Map.move( data.x, data.y, data.country );
},

//.. send - ここへ部隊出陣
send: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ];

	Map.send( data.x, data.y, data.country );
},

//.. send2 - 最寄りの拠点から出陣
send2: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ],
		village = Util.getVillageNearby( data.x, data.y, data.country );

	if ( village ) {
		Map.send( data.x, data.y, data.country, village );
	}
	else {
		Display.alert( '最寄りの拠点は見つかりませんでした。' );
	}
},

//.. fightHistoryAround
fightHistoryAround: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ],
		search  = 'type=0&find_name=&find_x=' + data.x + '&find_y=' + data.y + '&find_length=10&btn_exec=true';

	Map.fightHistory( search );
},

//.. fightHistoryAlliance
fightHistoryAlliance: function() {
	var idx  = $(this).attr('idx').toInt(),
		data = Map.analyzedData[ idx ],
		href;

	if ( !data.alliId ) { return; }

	href = '/alliance/info.php?id=' + data.alliId;

	Page.get( href )
	.pipe(function( html ) {
		var fullname = $(html).find('.alli_box_left > .alli_inputtext').first().text().trim(),
			search = 'type=1&find_name=' + encodeURIComponent( fullname ) + '&find_x=&find_y=&find_length=&btn_exec=true';

		Map.fightHistory( search );
	});
},

//.. checkFall
checkFall: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ];

	if ( !data.userId ) { return; }

	Page.get( '/user/?user_id=' + data.userId )
	.pipe(function( html ) {
		var $tr = $( html ).find('.common_table1').eq( 0 ).find('TR:contains("本領")'),
			land = $tr.find('A').eq( 1 ).attr('href'),
			map = land.replace('land', 'map');

		return $.get( map )
		.pipe(function( html ) {
			var $html = $( html ),
				idx = $html.find('#mapOverlayMap > AREA[onclick*="' + land + '"]').index(),
				$img = $html.find('#ig_mapsAll > IMG').not('[src$="outside.png"]').eq( idx );

			return ( $img.attr('src').indexOf('fall') != -1 );
		});
	})
	.pipe(function( fall ) {
		MetaStorage('USER_FALL').set( data.userId, fall );

		for ( var i = 0, len = Map.analyzedData.length; i < len; i++ ) {
			let areadata = Map.analyzedData[ i ];
			if ( areadata.userId != data.userId ) { continue; }
			if ( $.inArray( areadata.type, [ '城', '村', '砦' ] ) == -1 ) { continue; }

			let $img = $( '.' + areadata.class ).not('.imc_mark'),
				src = $img.attr('defaultsrc');

			if ( !fall ) {
				if ( src ) { $img.attr('src', src ); }

				areadata.fallmain = false;
			}
			else if ( areadata.type == '村' || areadata.type == '砦' ) {
				if ( src ) { $img.attr('defaultsrc', src ); }

				$img.attr('src', Env.externalFilePath + '/img/panel/fall_capital_r_l.png');

				areadata.fallmain = true;
			}
		}

		Map.analyzeReport();
	});
},

//.. userProfile
userProfile: function() {
	var idx  = $(this).attr('idx').toInt(),
		data = Map.analyzedData[ idx ],
		href;

	if ( data.discriminant == '自分' ) {
		href = '/user/';
	}
	else if ( data.userId ) {
		href = '/user/?user_id=' + data.userId;
	}
	else {
		//合戦中以外の他国
		var url = '/land.php?x=' + data.x + '&y=' + data.y + '&c=' + data.country;
		$.ajax({ type: 'get', url: url, async: false })
		.pipe(function( html ) {
			href = $(html).find('.ig_mappanel_dataarea').find('A[href^="/user"]').attr('href');
		});
	}

	if ( href ) { location.href = href; }
},

//.. alliancInfo
alliancInfo: function() {
	var idx  = $(this).attr('idx').toInt(),
		data = Map.analyzedData[ idx ],
		href;

	if ( data.alliId ) {
		href = '/alliance/info.php?id=' + data.alliId;
	}
	else {
		//合戦中以外の他国
		var url = '/land.php?x=' + data.x + '&y=' + data.y + '&c=' + data.country;
		$.ajax({ type: 'get', url: url, async: false })
		.pipe(function( html ) {
			href = $(html).find('.ig_mappanel_dataarea').find('A[href^="/alliance"]').attr('href');
		});
	}

	if ( href ) { location.href = href; }
},

//.. warList - 合戦報告書
warList: function( user, x, y, alliance ) {
	var search;

	user = ( user != undefined ) ? user : '';
	x = ( x != undefined ) ? x : '';
	y = ( y != undefined ) ? y : '';

	if ( alliance ) {
		search = 'm=&s=1&name=alliance&word=' + encodeURIComponent( alliance ) + '&coord=map&x=' + x + '&y=' + y;
	}
	else {
		search = 'm=&s=1&name=lord&word=' + encodeURIComponent( user ) + '&coord=map&x=' + x + '&y=' + y;
	}

	Page.get( '/war/list.php?' + search )
	.pipe(function( html ) {
		var $html = $(html);

		$html
		.find('.ig_battle_table TR').slice( 1 )
		.appendTo( $('#imi_warreport_list').empty() )
		.find('A').each(function() {
			var $this = $(this),
				newhref = $this.attr('href').replace(/detail\.php/, '/war/detail.php');

			$this.attr({ href: newhref, target: '_blank' });
		});

		$('#imi_tab_container').find('LI[target="imi_warlist"]').click();
	});
},

//.. ranking - 格付
ranking: function( user ) {
	var search = 'm=total&find_rank=&find_name=' + encodeURIComponent( user ) + '&c=0',
		$list = $('#imi_ranking_list'),
		len = $list.find('TD:nth-child(3)').find('A:contains("' + user + '")').length;

	if ( len > 0 ) {
		$('#imi_tab_container').find('LI[target="imi_ranking"]').click();

		return;
	}

	$('#imi_ranking_list').data( user, true );

	Page.get( '/user/ranking.php?' + search )
	.pipe(function( html ) {
		var $html = $(html),
			$tbody = $('#imi_ranking_list'),
			$tr;

		$tr = $html.find('table.common_table1 tr.now').removeAttr('class');
		$tr.find('TD').removeAttr('class').slice( 4 ).css( 'fontSize', 10 );
		$tr.find('A').attr( 'target', '_blank' );

		$tbody.prepend( $tr );

		$('#imi_ranking_list').removeData( user );

		$('#imi_tab_container').find('LI[target="imi_ranking"]').click();
	});
},

//.. score - 一戦撃破・防衛
score: function( user ) {
	var search = 'm=attack_score&find_rank=&find_name=' + encodeURIComponent( user ) + '&c=0',
		len = $('#imi_score_list').find('TD:nth-child(3)').find('A:contains("' + user + '")').length;

	if ( len > 0 ) {
		$('#imi_tab_container').find('LI[target="imi_score"]').click();

		return;
	}

	Page.get( '/user/ranking.php?' + search )
	.pipe(function( html ) {
		var $html = $(html),
			$tbody = $('#imi_score_list'),
			$tr;

		$tr = $html.find('table.common_table1 tr.now').removeAttr('class');
		$tr.find('TD').removeAttr('class').slice( 4 ).css( 'fontSize', 10 );
		$tr.find('A').attr( 'target', '_blank' );

		$tbody.prepend( $tr );

		$('#imi_tab_container').find('li[target="imi_score"]').click();
	});
},

//.. toCamp - この領地を陣にする
toCamp: function() {
	var idx  = $(this).attr('idx').toInt(),
		data = Map.analyzedData[ idx ],
		search = 'x=' + data.x + '&y=' + data.y + '&c=' + data.country,
		href = '/facility/to_camp.php?' + search + '&mode=build&type=223',
		result;

	result = confirm('この領地を陣に変更します。\nよろしいですか？');
	if ( !result ) { return; }

	//陣建設
	$.get( href )
	.pipe(function() {
		Map.move( Map.info.x, Map.info.y, Map.info.country );
	});
},

//.. createUnit - この拠点に部隊作成
createUnit: function( data, brigade ) {
	var village = Util.getVillageByName( data.castle );

	brigade |= 0;

	Deck.dialog( village, brigade );
},

//.. createUnitNearby
createUnitNearby: function( data, brigade ) {
	var village = Util.getVillageNearby( data.x, data.y, data.country ),
		coord = data.x + ',' + data.y;

	brigade |= 0;

	if ( village ) {
		Deck.dialog( village, brigade, coord );
	}
	else {
		Display.alert( '最寄りの拠点は見つかりませんでした。' );
	}
},

//.. changeVillage - この拠点を選択
changeVillage: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ],
		village = Util.getVillageByName( data.castle );

	if ( village ) {
		location.href = Util.getVillageChangeUrl( village.id, '/map.php' );
	}
	else{
		Display.alert( '拠点は見つかりませんでした。' );
	}
},

//.. nearbyVillage - 最寄りの拠点を選択
nearbyVillage: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ],
		village = Util.getVillageNearby( data.x, data.y, data.country );

	if ( village ) {
		location.href = Util.getVillageChangeUrl( village.id, '/map.php' );
	}
	else {
		Display.alert( '最寄りの拠点は見つかりませんでした。' );
	}
},

//.. renameVillage
renameVillage: function() {
	var $this = $(this),
		idx   = $this.attr('idx').toInt(),
		data  = Map.analyzedData[ idx ],
		village = Util.getVillageByName( data.castle ),
		html;

	if ( !village.id ) {
		Display.alert( '拠点は見つかりませんでした。' );
		return;
	}

	html = '' +
	'<div>' + village.name + '</div>' +
	'<br/>' +
	'<input id="imi_village_name" maxlength="12" style="ime-mode: active;" value="' + village.name + '" />';

	Display.dialog({
		title: '拠点名変更',
		width: 400, height: 60,
		content: html,
		buttons: {
			'決定': function() {
				var self = this,
					new_name = $('#imi_village_name').val();

				if ( new_name == village.name ) {
					self.close();
					return;
				}

				$.get('/user/change/change.php')
				.pipe(function( html ) {
					var $form = $(html).find('FORM[name="input_user_profile"]');

					if ( $form.length == 0 ) { return $.Deferred().reject(); }

					$form.find('INPUT[name="new_name\\[' + village.id + '\\]"]').val( new_name );
					return $.post('/user/change/change.php#ptop', $form.serialize() );
				})
				.pipe(function( html ) {
					var $form = $(html).find('FORM[name="input_user_profile"]');

					if ( $form.find('INPUT[name="btn_send"]').length == 0 ) { return $.Deferred().reject(); }

					$form.prepend('<INPUT type="hidden" name="btn_send" value="更新" />');
					return $.post('/user/change/change.php#ptop', $form.serialize() );
				})
				.done( location.reload )
				.fail(function() {
					Display.alert('変更に失敗しました。');
					self.close();
				});
			},
			'キャンセル': function() { this.close(); }
		}
	});

	$('#imi_village_name').focus();
},

//.. coordRegister - 座標登録
coordRegister: function() {
	var $this  = $(this),
		idx    = $this.attr('idx').toInt(),
		data   = Map.analyzedData[ idx ];

	Map.coordRegister( data.x, data.y, data.country, { user: data.user, castle: data.castle, type: data.type } );
	Map.coordList( data.country );
},

//.. coordUnregister - 座標削除
coordUnregister: function() {
	var $this = $(this),
		idx    = $this.attr('idx').toInt(),
		data   = Map.analyzedData[ idx ];

	Map.coordUnregister( data.x, data.y, data.country );
	Map.coordList( data.country );
},

//.. coordInfo
coordInfo: function( type, data ) {
	var text;

	if ( type == 1 ) {
		text = '(' + data.x + ',' + data.y + ')';
	}
	else {
		text = ( data.castle || data.type ) + ' (' + data.x + ',' + data.y + ')';
	}

	GM_setClipboard( text );
}

});

//■ CounteryMap
var CounteryMap = (function() {

var options = {
		size: ( Env.chapter >= 5 ) ? 150 : 180,
		pxsize: 1,
		pointsize: 3,
		fortresssize: 1,
		label: true,
		fortress: true
	},
	layer = {},
	$map, timer;

//. create
function create( country, _options ) {
	if ( $map ) { return $map; }

	options = $.extend( options, _options );
	options.mapsize = Math.ceil( ( options.size * 2 + 1 ) * options.pxsize );

	$map = $('<div id="imi_mapcontainer"><div id="imi_mousemap" /></div>');
	$map.css({ width: options.mapsize, height: options.mapsize, backgroundColor: '#000', zIndex: 201 });
	$map.find('#imi_mousemap').attr('country', country).click( mapClick );

	if ( options['label'] ) { showLabel(); }
	if ( options['fortress'] ) { showFortress(); }

	return $map;
}

//. showLabel
function showLabel() {
	var center = options.mapsize / 2;
	//東西-中央
	appendLabel( -12, ( center - 3 ), '0' );
	appendLabel( ( options.mapsize + 2 ), ( center - 3 ), '0' );
	//東西-上
	appendLabel( -12, 0, -options.size );
	appendLabel( -12, ( options.mapsize - 18 ), options.size );
	//東西-下
	appendLabel( ( options.mapsize + 2 ), 0, -options.size );
	appendLabel( ( options.mapsize + 2 ), ( options.mapsize - 18 ), options.size );
	//南北-中央
	appendLabel( ( center - 4 ), -7, '0' );
	appendLabel( ( center - 4 ), ( options.mapsize + 2 ), '0' );
	//南北-左
	appendLabel( 0, -19, options.size );
	appendLabel( ( options.mapsize - 10 ), -25, -options.size );
	//南北-右
	appendLabel( 0, ( options.mapsize + 2 ), options.size );
	appendLabel( ( options.mapsize - 10 ), ( options.mapsize + 2 ), -options.size );

	//座標表示用
	$map.append('<div id="imi_label"/>');
	$map.find('#imi_mousemap').mousemove( mapMouseMove )
	.mouseleave(function() {
		if ( timer != null ) {
			clearTimeout( timer );
			timer = null;
		}
	});
}

//. getCanvasX
function getCanvasX( x ) {
	return ( options.size + x ) * options.pxsize;
}

//. getCanvasY
function getCanvasY( y ) {
	return ( options.size - y ) * options.pxsize;
}

//. getCanvasPointX
function getCanvasPointX( x, size ) {
	var modsize = ( size - options.pxsize ) / 2;

	return Math.ceil( getCanvasX( x ) - modsize );
}

//. getCanvasPointY
function getCanvasPointY( y, size ) {
	var modsize = ( size - options.pxsize ) / 2;

	return Math.ceil( getCanvasY( y ) - modsize );
}

//. showFortress
function showFortress() {
	var $canvas = newLayer( 'fortress', options.mapsize, options.mapsize ),
		context = $canvas.get(0).getContext('2d'),
		compass = Data.compass,
		fortresses = Data.fortresses,
		x, y, canvasx, canvasy;

	//大殿
	canvasx = getCanvasPointX( 0, options.pointsize );
	canvasy = getCanvasPointY( 0, options.pointsize );
	drowPoint( context, canvasx, canvasy, options.pointsize, options.pointsize, '#f00' );

	//各砦
	for ( var i = 0, c_len = compass.length; i < c_len; i++ ) {
		x = compass[ i ].x,
		y = compass[ i ].y;

		for ( var j = 1, f_len = fortresses.length; j < f_len; j++ ) {
			canvasx = getCanvasPointX( x * fortresses[ j ][ 0 ], options.fortresssize );
			canvasy = getCanvasPointY( y * fortresses[ j ][ 1 ], options.fortresssize );

			drowPoint( context, canvasx, canvasy, options.fortresssize, options.fortresssize, '#fff' );
		}
	}
}

//. showViewArea
function showViewArea( mapinfo ) {
	var $canvas = newLayer( 'viewarea', options.mapsize, options.mapsize ),
		context = $canvas.get(0).getContext('2d'),
		startx  = mapinfo.x - ( Math.ceil( mapinfo.size / 2 ) - 1 ),
		starty  = mapinfo.y + ( Math.ceil( mapinfo.size / 2 ) - 1 ),
		canvasx = getCanvasX( startx ),
		canvasy = getCanvasY( starty ),
		width   = Math.ceil( mapinfo.size * options.pxsize ),
		height  = Math.ceil( mapinfo.size * options.pxsize );

	clear( context );
	drowArea( context, canvasx, canvasy, width, height );
}

//. showBasePoint
function showBasePoint( name, list, pointsize ) {
	var $canvas = newLayer( 'baselist' + name, options.mapsize, options.mapsize ),
		context = $canvas.get(0).getContext('2d'),
		canvasx, canvasy;

	pointsize = pointsize || options.pointsize;

	clear( context );

	//拠点
	for ( var i = 0, len = list.length; i < len; i++ ) {
		canvasx = getCanvasPointX( list[ i ].x, options.pointsize );
		canvasy = getCanvasPointY( list[ i ].y, options.pointsize );

		drowPoint( context, canvasx, canvasy, pointsize, pointsize, list[ i ].color );
	}
}

//. showRoute
function showRoute( list ) {
	var $canvas = newLayer( 'rute', options.mapsize, options.mapsize ),
		context = $canvas.get(0).getContext('2d');

	clear( context );

	for ( var i = 0, len = list.length; i < len; i++ ) {
		var { sx, sy, ex, ey, color } = list[ i ];

		sx = getCanvasX( sx );
		sy = getCanvasY( sy );
		ex = getCanvasX( ex );
		ey = getCanvasY( ey );

		drowLine( context, sx, sy, ex, ey, color );
	}
}

//. showPointer
function showPointer( x, y ) {
	var $canvas = newLayer( 'pointer', options.mapsize, options.mapsize ),
		context = $canvas.get(0).getContext('2d'),
		radius = options.pointsize + 1;

	clear( context );
	if ( x === undefined || y === undefined ) { return; }

	drowCircle( context, getCanvasX( x ), getCanvasY( y ), radius, '#fff' );
}

//. removeLayer
function removeLayer( name ) {
	if ( layer[ name ] ) { layer[ name ].remove(); }

	delete layer[ name ];
}

//. newLayer
function newLayer( name, width, height ) {
	var $canvas = layer[ name ];

	if ( $canvas ) { return $canvas; }

	$canvas = $('<canvas />').attr({ width: width, height: height });
	layer[ name ] = $canvas;

	$map.append( $canvas );

	return $canvas;
}

//. clear
function clear( context ) {
	context.clearRect( 0, 0, options.mapsize, options.mapsize );
}

//. drowPoint
function drowPoint( context, x, y, width, height, color ) {
	context.fillStyle = color;
	context.fillRect( x, y, width, height );
}

//. drowArea
function drowArea( context, x, y, width, height ) {
	context.fillStyle = '#66f';
	context.fillRect( x - 1, y - 1, width + 2, height + 2 );
	context.clearRect( x, y, width, height );
}

//. drowLine
function drowLine( context, startx, starty, endx, endy, color ) {
	context.strokeStyle = color;
	context.beginPath();
	context.moveTo( startx, starty );
	context.lineTo( endx, endy );
	context.stroke();

	context.fillStyle = color;
	//発射点
	context.beginPath();
	context.fillRect( startx - 1, starty - 1, 3, 3 );
	context.fill();
	//着弾点
	context.beginPath();
	context.arc( endx, endy, 2, 0, 360, false );
	context.fill();
}

//. drowCircle
function drowCircle( context, x, y, radius, color ) {
	x += 0.5;
	y += 0.5;

	context.lineWidth = ( radius >= 4 ) ? 2 : 1;
	context.strokeStyle = color;
	context.beginPath();
	context.arc( x, y, radius, 0, 360, false );
	context.stroke();
}

//. appendLabel
function appendLabel( top, left, text ) {
	$('<span>' + text + '</span>').css({ position: 'absolute', top: top, left: left })
	.appendTo( $map );
}

//. mapMouseMove
function mapMouseMove( e ) {
	var $this = $(this);

	$('#imi_label').hide();

	if ( timer != null ) {
		clearTimeout( timer );
		timer = null;
	}

	timer = setTimeout(function() {
		var offset = $this.offset(),
			x = e.pageX - offset.left,
			y = e.pageY - offset.top;

		$('#imi_label').css({ top: y + 20, left: x });

		x = Math.floor( x / options.pxsize );
		y = Math.floor( y / options.pxsize );

		if ( ( options.size * 2 ) >= x && x >= 0 && ( options.size * 2 ) >= y && y >= 0 ) {
			x = x - options.size;
			y = options.size - y;
			$('#imi_label').text( x + ', ' + y ).show();
		}
	}, 300);
}

//. mapClick
function mapClick( e ) {
	var $this = $(this),
		offset = $this.offset(),
		country = $this.attr('country'),
		x = Math.floor( ( e.pageX - offset.left ) / options.pxsize ),
		y = Math.floor( ( e.pageY - offset.top ) / options.pxsize );

	if ( ( options.size * 2 ) >= x && x >= 0 && ( options.size * 2 ) >= y && y >= 0 ) {
		x = x - options.size;
		y = options.size - y;

		Map.move( x, y, country );
	}
}

//. return
return {
	create: create,
	showViewArea: showViewArea,
	showBasePoint: showBasePoint,
	showRoute: showRoute,
	showPointer: showPointer
};

})();

//■ Deck
var Deck = function() {};

//. Deck
$.extend( Deck, {

//.. analyzedData
analyzedData: {},

//.. poolSoldiers
poolSoldiers: null,

//.. currentUnit
currentUnit: null,

//.. union
union: {
	added: null,
	materials: [],
},

//.. freeCost
freeCost: 0,

//.. ano
ano: 0,

//.. getPoolSoldiers
getPoolSoldiers: function() {
	Deck.poolSoldiers = Deck.poolSoldiers || Util.getPoolSoldiers();
	return Deck.poolSoldiers;
},

//.. setup
setup: function( free_cost, ano, card_list ) {
	Deck.currentUnit = new Unit( card_list );
	Deck.freeCost = free_cost + Deck.currentUnit.cost;
	Deck.ano = ano;
	Deck.filter.conditions = Deck.filter.conditions || [];
	Deck.sort.conditions = Deck.sort.conditions || [];
},

//.. update
update: function() {
	Deck.currentUnit.update();
	Deck.updateDeckInfo();
	Deck.updateDeckCard();
},

//.. updateDeckCard
updateDeckCard: function() {
	var cardlist = Deck.targetList(),
		$container = $('#ig_deck_smallcardarea_out'),
		$cards = $();

	for ( var i = 0, len = cardlist.length; i < len; i++ ) {
		$cards.push( cardlist[ i ].element[ 0 ] );
	}

	$container.append( $cards ).trigger('update');
},

//.. updateDeckInfo
updateDeckInfo: function() {
	$('#imi_deck_info').trigger('update');
},

//.. targetList
targetList: function() {
	var cardlist;

	cardlist = Deck.filter( Deck.analyzedData );
	cardlist = Deck.sort( cardlist );

	return cardlist;
},

//.. filter
filter: function( cardlist ) {
	var conditions = Deck.filter.conditions,
		exceptions = Deck.filter.exceptions,
		list = [];

	for ( var card_id in cardlist ) {
		let card = cardlist[ card_id ];

		if ( exceptions[ card_id ] ) {
			card.element.hide();
		}
		else if ( card.match( conditions ) ) {
			card.element.show();
			list.push( card );
		}
		else {
			card.element.hide();
		}
	}

	return list;
},

//.. sort
sort: function( cardlist ) {
	var order = [].concat( Deck.sort.conditions );

	if ( Deck.dialog.loaded ) {
		order.push( [ 'cardNo', 'asc' ] );
	}

	return cardlist.sort(function( a, b ) {
		for ( var i = 0, len = order.length; i < len; i++ ) {
			let [ prop, option, convert ] = order[ i ],
				aValue, bValue;

			if ( convert ) {
				aValue = convert( a );
				bValue = convert( b );
			}
			else {
				aValue = a[ prop ];
				bValue = b[ prop ];
			}

			if ( option == 'desc' && aValue < bValue ) {
				//降順
				return true;
			}
			else if ( option == 'asc' && aValue > bValue ) {
				//昇順
				return true;
			}
			else if ( aValue == bValue ) {
				continue;
			}
			else {
				return false;
			}
		}

		return false;
	});
},

//.. commandMenu
commandMenu: function( container, up ) {
	Deck.filterMenu( container, up );
	Deck.sortMenu( container, up );

	//表示条件ボタン
	container
	.on('update', function() {
		var $li = container.find('LI'),
			conditions, cardlist;

		conditions = [];
		$li.filter('.imc_filter').each(function() {
			var selecter = $(this).data('selecter');
			if ( selecter ) { conditions.push( selecter ); }
		});
		Deck.filter.conditions = conditions;

		conditions = [];
		$li.filter('.imc_sort').each(function() {
			var selecter = $(this).data('selecter');
			if ( selecter ) { conditions.push( selecter ); }
		});
		Deck.sort.conditions = conditions;

		Deck.updateDeckCard();
	})
	.on('click', 'A', function() {
		var $this = $(this),
			data = $this.data('selecter'),
			$li = $this.closest('LI');

		$li.find('SPAN').text( $this.text() );
		$li.data( 'selecter', data );

		if ( data == null ) {
			$li.removeClass('imc_selected');
		}
		else {
			$li.addClass('imc_selected');
		}

		//フィルタ変更の場合
		if ( $li.hasClass('imc_filter') ) {
			Deck.filter.exceptions = {};
		}

		container.trigger('update');
	});
},

//.. filterMenu
filterMenu: function( container, up ) {
	var menulist;

	container.append('<label>フィルタ</label>');

	menulist = [
		[
			{ title: '全て',   selecter: null },
			{ title: '未編成', selecter: [ 'soltype', 'none' ] }
		],
		[
			{ title: '槍',       selecter: [ 'soltype', [ 321, 322, 323, 324 ] ] },
			{ title: '武士',     selecter: [ 'soltype', [ 323 ] ] },
			{ title: '長槍足軽', selecter: [ 'soltype', [ 322 ] ] },
			{ title: '足軽',     selecter: [ 'soltype', [ 321 ] ] },
			{ title: '国人衆',   selecter: [ 'soltype', [ 324 ] ] }
		],
		[
			{ title: '弓',     selecter: [ 'soltype', [ 325, 326, 327, 328 ] ] },
			{ title: '弓騎馬', selecter: [ 'soltype', [ 327 ] ] },
			{ title: '長弓兵', selecter: [ 'soltype', [ 326 ] ] },
			{ title: '弓足軽', selecter: [ 'soltype', [ 325 ] ] },
			{ title: '海賊衆', selecter: [ 'soltype', [ 328 ] ] }
		],
		[
			{ title: '馬',       selecter: [ 'soltype', [ 329, 330, 331, 332 ] ] },
			{ title: '赤備え',   selecter: [ 'soltype', [ 331 ] ] },
			{ title: '精鋭騎馬', selecter: [ 'soltype', [ 330 ] ] },
			{ title: '騎馬兵',   selecter: [ 'soltype', [ 329 ] ] },
			{ title: '母衣衆',   selecter: [ 'soltype', [ 332 ] ] }
		],
		[
			{ title: '兵器',     selecter: [ 'soltype', [ 333, 334, 335, 336, 337, 338 ] ] },
			{ title: '騎馬鉄砲', selecter: [ 'soltype', [ 337 ] ] },
			{ title: '雑賀衆',   selecter: [ 'soltype', [ 338 ] ] },
			{ title: '鉄砲足軽', selecter: [ 'soltype', [ 336 ] ] },
			{ title: '大筒兵',   selecter: [ 'soltype', [ 335 ] ] },
			{ title: '攻城櫓',   selecter: [ 'soltype', [ 334 ] ] },
			{ title: '破城鎚',   selecter: [ 'soltype', [ 333 ] ] }
		]
	];

	Deck.createMenu( container, 'imc_filter', menulist, '全て', up );

	menulist = [
		[
			{ title: '指定無し', selecter: null },
			{ title: '配置可', selecter: [ '', true, 'eq', function( card ) { return card.canAssign(); } ] }
		],
		[
			{ title: '第一組',   selecter: [ 'brigade', 1 ] },
			{ title: '第二組',   selecter: [ 'brigade', 2 ] },
			{ title: '第三組',   selecter: [ 'brigade', 3 ] },
			{ title: '第四組',   selecter: [ 'brigade', 4 ] },
			{ title: '未設定',   selecter: [ 'brigade', 5 ] }
		],
		[
			{ title: 'Cost 4',   selecter: [ 'cost', 4 ] },
			{ title: 'Cost 3.5', selecter: [ 'cost', 3.5 ] },
			{ title: 'Cost 3',   selecter: [ 'cost', 3 ] },
			{ title: 'Cost 2.5', selecter: [ 'cost', 2.5 ] },
			{ title: 'Cost 2',   selecter: [ 'cost', 2 ] },
			{ title: 'Cost 1.5', selecter: [ 'cost', 1.5 ] },
			{ title: 'Cost 1',   selecter: [ 'cost', 1 ] },
		],
		[
			{ title: '★★★★★', selecter: [ 'rank', 5 ] },
			{ title: '★★★★',   selecter: [ 'rank', 4 ] },
			{ title: '★★★',     selecter: [ 'rank', 3 ] },
			{ title: '★★',       selecter: [ 'rank', 2 ] },
			{ title: '★',         selecter: [ 'rank', 1 ] },
			{ title: '☆',         selecter: [ 'rank', 0 ] },
		],
		[
			{ title: 'Lv20',     selecter: [ 'lv', 20 ] },
			{ title: 'Lv19以下', selecter: [ 'lv', 19, 'lt' ] },
			{ title: 'Lv1以上',  selecter: [ 'lv', 1, 'gt' ] },
			{ title: 'Lv0',      selecter: [ 'lv', 0 ] },
		],
		[
			{ title: '兵数最大',   selecter: [ 'solNum', 'max' ] },
			{ title: '最大以外',   selecter: [ 'solNum', 'max', 'ne' ] },
			{ title: '兵数２以上', selecter: [ 'solNum', 2, 'gt' ] },
			{ title: '兵数１以上', selecter: [ 'solNum', 1, 'gt' ] },
			{ title: '兵数１',     selecter: [ 'solNum', 1 ] }
		],
		[
			{ title: 'HP最大',    selecter: [ 'hp', 'max' ] },
			{ title: 'HP99以下',  selecter: [ 'hp', 99, 'lt' ] },
			{ title: '討伐300',   selecter: [ 'battleGage', 300 ] }
		],
	];

	Deck.createMenu( container, 'imc_filter', menulist, '指定無し', up );
	Deck.createMenu( container, 'imc_filter', menulist, '指定無し', up );
	Deck.filter.conditions = [];
	Deck.filter.exceptions = {};
},

//.. sortMenu
sortMenu: function( container, up ) {
	var menulist;

	container.append('<label>ソート</label>');

	menulist = [
		[
			{ title: '指定無し', selecter: null },
		],
		[
			{ title: '総攻：降', selecter: [ 'totalAtk', 'desc' ] },
			{ title: '総攻：昇', selecter: [ 'totalAtk', 'asc' ] },
			{ title: '総防：降', selecter: [ 'totalDef', 'desc' ] },
			{ title: '総防：昇', selecter: [ 'totalDef', 'asc' ] },
			{ title: '速度：降', selecter: [ 'speed', 'desc', function( card ) { return Util.getSpeed( [ card ] ); } ] },
			{ title: '速度：昇', selecter: [ 'speed', 'asc', function( card ) { return Util.getSpeed( [ card ] ); } ] }
		],
		[
			{ title: '攻撃力：降', selecter: [ 'atk', 'desc' ] },
			{ title: '攻撃力：昇', selecter: [ 'atk', 'asc' ] },
			{ title: '防御力：降', selecter: [ 'def', 'desc' ] },
			{ title: '防御力：昇', selecter: [ 'def', 'asc' ] },
			{ title: '兵法：降', selecter: [ 'int', 'desc' ] },
			{ title: '兵法：昇', selecter: [ 'int', 'asc' ] }
		],
		[
			{ title: '兵数：降', selecter: [ 'solNum', 'desc' ] },
			{ title: '兵数：昇', selecter: [ 'solNum', 'asc' ] },
			{ title: '指揮力：降', selecter: [ 'maxSolNum', 'desc' ] },
			{ title: '指揮力：昇', selecter: [ 'maxSolNum', 'asc' ] },
			{ title: '破壊力：降', selecter: [ 'totalDes', 'desc' ] },
			{ title: '破壊力：昇', selecter: [ 'totalDes', 'asc' ] }
		],
		[
			{ title: 'コスト：降', selecter: [ 'cost', 'desc' ] },
			{ title: 'コスト：昇', selecter: [ 'cost', 'asc' ] },
			{ title: 'レア度：降', selecter: [ 'rarity', 'desc', function( card ) { return { '天': 7, '極': 6, '特': 5, '上': 4, '序': 3, '祝': 2, '雅': 1 }[ card.rarity ]; } ] },
			{ title: 'レア度：昇', selecter: [ 'rarity', 'asc', function( card ) { return { '天': 7, '極': 6, '特': 5, '上': 4, '序': 3, '祝': 2, '雅': 1 }[ card.rarity ]; } ] }
		],
		[
			{ title: 'ランク：降', selecter: [ 'rank', 'desc' ] },
			{ title: 'ランク：昇', selecter: [ 'rank', 'asc' ] },
			{ title: 'レベル：降', selecter: [ 'lv', 'desc' ] },
			{ title: 'レベル：昇', selecter: [ 'lv', 'asc' ] }
		],
		[
			{ title: 'HP：降',   selecter: [ 'hp', 'desc' ] },
			{ title: 'HP：昇',   selecter: [ 'hp', 'asc' ] },
			{ title: '討伐：降', selecter: [ 'battleGage', 'desc' ] },
			{ title: '討伐：昇', selecter: [ 'battleGage', 'asc' ] }
		]
	];

	Deck.createMenu( container, 'imc_sort', menulist, '指定無し', up );
	Deck.createMenu( container, 'imc_sort', menulist, '指定無し', up );
	Deck.sort.conditions = [];
},

//.. createMenu
createMenu: function( container, type, menulist, selected, up ) {
	var $li = $('<li class="' + type + '"><span></span></li>'),
		submenu = $('<div class="imc_pulldown" />');

	for ( var i = 0, len = menulist.length; i < len; i++ ) {
		let list = menulist[ i ],
			$div = $('<div/>').appendTo( submenu );

		for ( var j = 0, lenj = list.length; j < lenj; j++ ) {
			let $a = $('<a class="imc_pulldown_item" href="javascript:void(0);">' + list[ j ].title + '</a>');

			$a.data('selecter', list[ j ].selecter);
			$div.append( $a );

			if ( list[ j ].title == selected ) {
				$li.data( 'selecter', list[ j ].selecter ).find('SPAN').text( list[ j ].title );
			}
		}
	}

	if ( submenu.find('A').length == 0 ) { return; }

	$li
	.appendTo( container )
	.append( submenu );

	if ( up ) {
		submenu.css({ marginTop: -( submenu.outerHeight() + $li.height() ) });
	}
},

//.. setUnit
setUnit: function( cardlist, num, type ) {
	var pooldata = $.extend( {}, Deck.getPoolSoldiers().pool ),
		editlist = [];

	for ( var i = 0, len = cardlist.length; i < len; i++ ) {
		let card = cardlist[ i ],
			newType = type || card.solType,
			newNum = ( num <= card.maxSolNum ) ? num : card.maxSolNum,
			pool;

		if ( num == card.solNum && newType == card.solType ) { continue; }

		pooldata[ card.solType ] += card.solNum;
		pool = pooldata[ newType ];

		if ( pool == 0 ) {
			pooldata[ card.solType ] -= card.solNum;
			continue;
		}
		else if ( pool >= newNum ) {
			editlist.push( [ card, newNum, newType ] );
			pool -= newNum;
		}
		else {
			editlist.push( [ card, pool, newType ] );
			pool = 0;
		}

		pooldata[ newType ] = pool;
	}

	return Deck.editCard( editlist );
},

//.. setUnitMax
setUnitMax: function( cardlist, type ) {
	return Deck.setUnit( cardlist, 99999, type );
},

//.. gatherSoldier
gatherSoldier: function( cardlist, num ) {
	var pooldata = $.extend( {}, Deck.getPoolSoldiers().pool ),
		editlist = [];

	for ( var i = 0, len = cardlist.length; i < len; i++ ) {
		let card = cardlist[ i ];

		pooldata[ card.solType ] += card.solNum - 1;
		editlist.push( [ card, 1, card.solType ] );
	}

	for ( var i = 0, len = editlist.length; i < len; i++ ) {
		let [ card, newNum, type ] = editlist[ i ],
			pool = pooldata[ type ] + newNum;

		newNum = ( num <= card.maxSolNum ) ? num : card.maxSolNum;

		if ( pool >= newNum ) {
			editlist[ i ] = [ card, newNum, type, ( newNum - card.solNum ) ];
			pool -= newNum;
		}
		else {
			editlist[ i ] = [ card, pool, type, ( pool - card.solNum ) ];
			pool = 0;
		}

		pooldata[ type ] = pool;
	}

	editlist = editlist.sort(function( a, b ) {
		return ( a[ 3 ] > b[ 3 ] );
	});

	return Deck.editCard( editlist );
},

//.. gatherSoldierMax
gatherSoldierMax: function( cardlist ) {
	return Deck.gatherSoldier( cardlist, 99999 );
},

//.. editCard
editCard: function( editlist ) {
	var dfd = $.Deferred(),
		ol = Display.dialog();

	ol.message('一括編成処理開始...');

	(function( idx ) {
		if ( idx >= editlist.length ) {
			dfd.resolve();
			return;
		}

		var self = arguments.callee,
			[ card, num, type ] = editlist[ idx ];

		if ( card.solNum == num && card.solType == type ) {
			self.call( self, ++idx );
		}
		else {
			ol.message( card.name + '編成中...' );

			card.setUnit( num, type )
			.pipe(function() { return Util.wait( 100 ); })
			.done(function() { self.call( self, ++idx ); })
			.fail(function() { dfd.reject(); });
		}
	})( 0 );

	dfd
	.done(function() {
		ol.message('編成完了しました。');
	})
	.fail(function( text ) {
		text = text || '編成完了できませんでした。';
		ol.message( text );
	})
	.always(function() {
		Deck.update();
		Util.wait( 500 ).pipe( ol.close );
	});

	return dfd;
},

//.. addCard
addCard: function( e ) {
	var $target = $(e.target),
		deck_mode = $('#imi_mode').hasClass('imc_deck_mode');

	if ( $target.is('A') || $target.parent().is('A') ) { return; }

	if ( deck_mode ) {
		Deck.addCardDeck.call( this );
	}
	else {
		Deck.addCardUnion.call( this );
	}
},

//.. addCardDeck
addCardDeck: function() {
	var $this = $(this),
		card_id = $this.attr('card_id'),
		card = Deck.analyzedData[ card_id ];

	if ( !card || !card.canAssign() ) { return; }

	if ( $this.hasClass('imc_selected') ) {
		//選択武将削除
		Deck.currentUnit.removeCard( card );
		card.element.removeClass('imc_selected');
	}
	else {
		//選択武将追加
		if ( Deck.currentUnit.addCard( card ) ) {
			card.element.addClass('imc_selected');
		}
	}

	Deck.updateDeckInfo();
},

//.. addCardUnion
addCardUnion: function() {
	var $this = $(this),
		card_id = $this.attr('card_id'),
		card = Deck.analyzedData[ card_id ];

	if ( $this.hasClass('imc_selected') ) {
		//選択武将削除
		if ( card_id == Deck.union.added ) {
			Deck.union.added = null;
		}
		else {
			Deck.union.materials = Deck.union.materials.filter(function( elem, idx, array ) {
				return ( elem != card_id );
			});
		}

		$('#ig_deck_smallcardarea_out').children('.ig_deck_smallcardarea, TR').filter('[card_id="' + card_id + '"]').removeClass('imc_selected imc_added');
		$('#imi_card_container1').find('DIV[card_id="' + card_id + '"]').remove();
	}
	else if ( !Deck.union.added ) {
		if ( !card.canUnion() ) {
			Display.info('このカードは合成に使用できません。');
			return;
		}

		Deck.union.added = card_id;

		//選択武将追加
		$this.addClass('imc_selected imc_added');
		$('#imi_card_container2').append( card.clone() );
	}
	else if ( Deck.union.materials.length < 5 ) {
		if ( !card.useMaterial() ) {
			Display.info('このカードは合成に使用できません。');
			return;
		}

		Deck.union.materials.push( card_id );

		//選択武将追加
		$this.addClass('imc_selected');
		$('#imi_card_container3').append(
			card.clone()
			.find('.imc_card_header, .ig_deck_smallcarddataarea').remove().end()
		);
	}
	else {
		Display.info('これ以上選択できません。');
	}

	return;
},

//.. assignCard
assignCard: function( village_id, unit_id ) {
	if ( Deck.ano >= 5 ) {
		Display.alert('これ以上部隊を作成できません。');
		return $.Deferred().reject();
	}

	if ( unit_id ) { village_id = ''; }
	else { unit_id = ''; }

	return Deck.currentUnit.assignCard( village_id, unit_id );
},

//.. contextmenu
contextmenu: function() {
	var $this = $(this),
		card_id = $this.attr('card_id'),
		card = Deck.analyzedData[ card_id ],
		data = Deck.getPoolSoldiers(),
		menu = {}, pool = [], submenu, num;

	menu[ card.name ] = $.contextMenu.title;

	//出品中
	if ( card.isExhibited ) {
		menu['出品中です'] = $.contextMenu.nothing;
		menu['セパレーター1'] = $.contextMenu.separator;

		submenu = {};
		submenu[ '「' + card.name + '」を検索' ] = function() { Util.searchTradeCardNo( card.cardNo ); };
		submenu['セパレーター1'] = $.contextMenu.separator;

		card.skillList.forEach(function( skill ) {
			submenu[ '「' + skill.name + '」を検索' ] = function() { Util.searchTradeSkill( skill.name ); };
		});

		menu['取引検索'] = submenu;

		return menu;
	}

	var union_mode = $('#imi_mode').hasClass('imc_union_mode'),
		selected = $this.hasClass('imc_selected'),
		added_cid = Deck.union.added || '',
		material_cid = Deck.union.materials,
		separator = false,
		added_card;

	if ( added_cid ) { added_card = Deck.analyzedData[ added_cid ]; }

	if ( $this.find('.levelup_btn').length ) {
		menu['レベルアップ！'] = function () {
			location.href = '/card/status_info.php?cid=' + card_id + '&p=1&ano=0&dmo=nomal';
		}
		separator = true;
	}
	else {
		menu['ステータス確認'] = function () {
			location.href = '/card/status_info.php?cid=' + card_id + '&p=1&ano=0&dmo=nomal';
		}
		separator = true;
	}

	if ( $this.find('.rankup_btn').length ) {
		menu['ランクアップ！'] = function () {
			location.href = '/card/lead_info.php?cid=' + card_id + '&p=1&ano=0&dmo=nomal';
		}
		separator = true;
	}

	if ( separator ) {
		menu['セパレーター1'] = $.contextMenu.separator;
		separator = false;
	}

	if ( card.solType ) {
		num = data.pool[ card.solType ] || 0;
		submenu = {};

		if ( num > 0 && card.solNum > 0 && card.solNum < card.maxSolNum ) {
			submenu['最大補充'] = function() {
				card.setUnitMax()
				.done( Deck.update )
				.fail(function() { Display.alert('編成できませんでした。'); });
			};
		}

		[ 1, 10, 250, 500 ].forEach(function( value ) {
			if ( value >= num + card.solNum ) { return; }

			submenu[ '兵数 ' + value + ' セット' ] = function() {
				card.setUnit( value )
				.done( Deck.update )
				.fail(function() { Display.alert('編成できませんでした。'); });
			};
		});

		if ( card.solNum > 100 ) {
			submenu['セパレーター'] = $.contextMenu.separator;
			submenu['兵数 100 減らす'] = function() {
				card.setUnit( card.solNum - 100 )
				.done( Deck.update )
				.fail(function() { Display.alert('編成できませんでした。'); });
			};
		}

		if ( $.isEmptyObject( submenu ) ) {
			menu['兵数変更'] = $.contextMenu.nothing;
		}
		else {
			menu['兵数変更'] = submenu;
		}
	}
	else {
		menu['兵数変更'] = $.contextMenu.nothing;
	}

	$.each( Soldier.typeKeys, function( type ) {
		var poolnum = data.pool[ type ] || 0;

		if ( type == card.solType ) { return; }
		if ( poolnum == 0 ) { return; }

		pool.push({ type: type, name: '' + this, num: poolnum });
	});

	if ( pool.length > 0 ) {
		submenu = {};

		pool.forEach(function( poolSol ) {
			var menu = {}, base, max;

			base = Math.min( poolSol.num, card.solNum );
			max = Math.min( poolSol.num, card.maxSolNum );

			if ( max >= base ) {
				menu['兵数最大 ( ' + max + ' )'] = function() {
					card.setUnit( max, poolSol.type )
					.done( Deck.update )
					.fail(function() { Display.alert('編成できませんでした。'); });
				}
			}
			if ( base != max && base >= 2 ) {
				menu['現状維持 ( ' + base + ' )'] = function() {
					card.setUnit( base, poolSol.type )
					.done( Deck.update )
					.fail(function() { Display.alert('編成できませんでした。'); });
				}
			}
			menu['兵数 1'] = function() {
				card.setUnit( 1, poolSol.type )
				.done( Deck.update )
				.fail(function() { Display.alert('編成できませんでした。'); });
			}

			submenu[ poolSol.name + ' ( ' + poolSol.num + ' )' ] = menu;
		});

		menu['兵種変更'] = submenu;
	}
	else {
		menu['兵種変更'] = $.contextMenu.nothing;
	}

	menu['兵編成'] = function() { card.editUnit().done( Deck.update ); };
	menu['セパレーター2'] = $.contextMenu.separator;

	//合成可能な場合のメニュー
	if ( card.canUnion() && !( union_mode && selected ) ) {
		submenu = {};

		if ( card.canRankup() ) {
			//素材カードが指定されている場合、ランクとレベルチェック
			if ( added_card && ( added_card.lv < 20 || added_card.rank < card.rank ) ) {
				//条件を満たしていない場合、表示しない
			}
			else {
				submenu['ランクアップ'] = function() { Card.rankup( card_id, added_cid, material_cid ); };
			}
		}

		if ( card.canSkillLvup() ) {
			submenu['スキル強化'] = function() { Card.skillLevelup( card_id, added_cid, material_cid ); };
		}
		else {
			submenu['スキル強化'] = $.contextMenu.nothing;
		}

		if ( card.canSkillAdd() ) {
			submenu['スキル追加'] = function() { Card.skillAdd( card_id, added_cid ); };
		}
		else {
			submenu['スキル追加'] = $.contextMenu.nothing;
		}

		if ( card.canSkillRemove() ) {
			submenu['スキル削除'] = function() { Card.skillRemove( card_id ); };
		}
		else {
			submenu['スキル削除'] = $.contextMenu.nothing;
		}

		menu['カード合成'] = submenu;
	}

	submenu = {};
	submenu[ '「' + card.name + '」を検索' ] = function() { Util.searchTradeCardNo( card.cardNo ); };
	submenu['セパレーター1'] = $.contextMenu.separator;

	card.skillList.forEach(function( skill ) {
		submenu[ '「' + skill.name + '」を検索' ] = function() { Util.searchTradeSkill( skill.name ); };
	});

	menu['取引検索'] = submenu;

	/*
	if ( card.canExhibit() ) {
		menu['出品する'] = function() { Card.exhibit( card_id ); };
	}
	*/

	menu['カードを削除'] = function() { Card.delete( [ card_id ] ); };

	return menu;
}

});

//. Deck.dialog
Deck.dialog = function( village, brigade, coord ) {
	var enemylist = MetaStorage('UNIT_STATUS').get('敵襲') || [],
		now = Util.getServerTime(),
		target_x, target_y,
		html, $content, options, dialog;

	html = '' +
	'<div class="imc_infotype_1">' +
		'<div style="height: 155px; margin-bottom: 5px;">' +
			'<div id="imi_card_container"></div>' +
			'<ul id="imi_deck_info">' +
				'<li><label>拠点</label><span class="imc_village"></span></li>' +
				'<li><label>コスト</label><span class="imc_info1"></span>/<span class="imc_info1_free"></span><label>部隊枠</label><span class="imc_info2"></span>/<span class="imc_info2_free"></span></li>' +
				'<li><label>攻撃力</label><span class="imc_info3">0</span><label>破壊力</label><span class="imc_info6"></span></li>' +
				'<li><label>防御力</label><span class="imc_info4">0</span></li>' +
				'<li><label>速度</label><span class="imc_info5">0</span><label>時間</label><span class="imc_info7"></span></li>' +
				'<li><label>目的地</label><input class="imc_info8" /><label>時間</label><span class="imc_info9"></span></li>' +
			'</ul>' +
		'</div>' +
		'<div>' +
			'<ul id="imi_new_deck">' +
				'<li id="imi_card_assign">選択武将を部隊へ登録</li>' +
				'<li id="imi_all_assign">全部隊登録</li>' +
				'<li id="imi_info_change" class="imc_infotype_1"></li>' +
			'</ul>' +
			'<ul id="imi_command_selecter" class="imc_command_selecter" />' +
		'</div>' +
		'<div id="imi_info" style="border: solid 1px #b8860b; height: 343px; padding-top: 20px; background-color: #000; color: #fff; font-size: 18px; text-align: center;">武将カード情報取得中...</div>' +
		'<div id="ig_deck_smallcardarea_out" style="border: solid 1px #b8860b; height: 355px; padding: 4px; background-color: #000; overflow: auto;">' +
		'</div>' +
	'</div>';

	$content = $( html );
	$content
	.on( 'click', '.ig_deck_smallcardarea', function() {
		Deck.addCardDeck.call( this );
	})
	.on( 'click', '#imi_info_change', function() {
		var $this = $(this);

		if ( $this.hasClass('imc_infotype_1') ) {
			$('.imc_infotype_1').removeClass('imc_infotype_1').addClass('imc_infotype_2');
		}
		else {
			$('.imc_infotype_2').removeClass('imc_infotype_2').addClass('imc_infotype_1');
		}
	})
	.on( 'change', '.imc_info8', function() {
		$('#imi_deck_info').trigger('update');
		dialog.buttons.eq( 0 ).attr('disabled', ( $('.imc_info9').text() == '' ) );
	})
	.on( 'update', '#imi_deck_info', function() {
		var unit = Deck.currentUnit,
			speed = unit.speed,
			time = ( speed == 0 ) ? 0 : Math.floor( 3600 / speed );

		$('.imc_info1').text( unit.cost.toFixed( 1 ) );
		$('.imc_info1_free').text( Deck.freeCost.toFixed( 1 ) );
		$('.imc_info2').text( Deck.ano );
		$('.imc_info2_free').text( 5 );
		$('.imc_info3').text( Math.floor( unit.atk ).toFormatNumber() );
		$('.imc_info4').text( Math.floor( unit.def ).toFormatNumber() );
		$('.imc_info5').text( speed.toRound( 1 ) );
		$('.imc_info6').text( unit.des.toFormatNumber() );
		$('.imc_info7').text( time.toFormatTime() + '／距離' );

		var text = $('.imc_info8').val(),
			match = text.match(/(-?\d{1,3})[^\d-]+(-?\d{1,3})/),
			dist;

		if ( match ) {
			target_x = match[ 1 ].toInt();
			target_y = match[ 2 ].toInt();
			dist = Util.getDistance( village, { x: target_x, y: target_y } );
			time = ( speed == 0 ) ? 0 : Math.floor( 3600 * dist / speed );

			$('.imc_info9').text( time.toFormatTime() + '／' + dist.toRound( 2 ) );
		}
		else {
			$('.imc_info9').text('');
		}

		$('#imi_card_container').empty();
		for ( var i = 0, len = unit.assignList.length; i < len; i++ ) {
			$('#imi_card_container').append( unit.assignList[ i ].clone() );
		}
	})
	.on( 'click', '#imi_all_assign', function() {
		var dfd = $.Deferred(),
			html, $html;

		html = '' +
		'<div style="padding-left: 1px;">' +
		'全部隊登録処理を行います。<br/>よろしいですか？' +
		'</div>' +
		'<table id="imi_unitnum" class="imc_table" style="margin: 10px auto 0px auto;">' +
			'<tr><th colspan="4">部隊毎の武将数指定</th></tr>' +
			'<tr><td class="imc_selected" data-unitnum="4">４武将</td><td data-unitnum="3">３武将</td><td data-unitnum="2">２武将</td><td data-unitnum="1">１武将</td></tr>' +
		'</table>' +
		'<div style="margin: 8px 0px 2px 0px;"><label><input id="imi_dungeon" type="checkbox" /> 登録完了後に秘境探索画面へ</label></div>';

		$html = $( html );
		$html.find('TD')
		.hover( Util.enter, Util.leave )
		.click(function() {
			$('#imi_unitnum .imc_selected').removeClass('imc_selected');
			$(this).addClass('imc_selected');
		});

		Display.dialog({
			title: '全部隊登録',
			width: 320, height: 'auto',
			content: $html,
			buttons: {
				'決定': function() {
					var unitnum = $('#imi_unitnum .imc_selected').data('unitnum').toInt(),
						dungeon = $('#imi_dungeon').attr('checked');

					this.close();
					dfd.resolve( unitnum, dungeon );
				},
				'キャンセル': function() {
					this.close();
					dfd.reject();
				}
			}
		});

		dfd
		.pipe(function( unitnum, dungeon ) {
			var cardlist = Deck.targetList(),
				assignlist = [],
				namelist = {},
				freecost = Deck.freeCost,
				freecard = ( 5 - Deck.ano ) * unitnum;

			if ( freecost == 0 || freecard == 0 ) {
				Display.alert('編成できませんでした。');
				return $.Deferred().reject();
			}

			for ( var i = 0, len = cardlist.length; i < len && freecard > 0; i++ ) {
				let card = cardlist[ i ];
				if ( !card.canAssign() ) { continue; }
				if ( card.cost > freecost ) { continue; }
				if ( namelist[ card.name ] ) { continue; }

				namelist[ card.name ] = true;
				freecost -= card.cost;
				freecard--;
				assignlist.push( card );
			}

			if ( assignlist.length == 0 ) {
				Display.alert('編成できませんでした。');
				return $.Deferred().reject();
			}

			return [ assignlist, unitnum, dungeon ];
		})
		.pipe(function( param ) {
			var self = arguments.callee,
				[ assignlist, unitnum, dungeon ] = param,
				unit;

			if ( assignlist.length == 0 ) {
				Display.dialog().message('ページを更新します...');

				if ( dungeon ) {
					location.href = Util.getVillageChangeUrl( village.id, '/facility/dungeon.php' );
				}
				else {
					location.reload();
				}
				return;
			}

			unit = new Unit();
			for ( var i = 0; i < unitnum && assignlist.length > 0; i++) {
				unit.assignList.push( assignlist.shift() );
			}

			unit.assignCard( village.id )
			.done(function() {
				Deck.ano++;
			})
			.always(function( ol ) {
				if ( ol && ol.close ) { ol.close(); }
				self( param );
			});
		});
	})
	.on( 'click', '#imi_card_assign', function() {
		Deck.assignCard( village.id )
		.done(function() {
			var cardlist = Deck.analyzedData,
				assignlist = Deck.currentUnit.assignList,
				free_cost = Deck.freeCost - Deck.currentUnit.cost,
				namelist = {};

			for ( var i = 0, len = assignlist.length; i < len; i++ ) {
				let card = assignlist[ i ];

				card.element.remove();
				card.element = null;

				namelist[ card.name ] = 1;
				delete cardlist[ card.cardId ];
			}

			for ( var card_id in cardlist ) {
				let card = cardlist[ card_id ];

				if ( namelist[ card.name ] ) {
					card.gounit = '0';
					card.update();
				}
			}

			$('#imi_card_container').empty();
			$('#ig_deck_smallcardarea_out').find('.imc_selected').remove();
			Deck.setup( free_cost, Deck.ano + 1 );
			Deck.updateDeckInfo();
		})
		.always(function( ol ) {
			if ( ol && ol.close ) { setTimeout( ol.close, 500 ); }
		});
	});

	options = {
		title: '部隊作成',
		width: 880, height: 550, top: 20,
		content: $content,
		buttons: {
			'目的地へ出陣': function() {
				Map.send( target_x, target_y, village.country, village );
			},
			'編成を終了': function() {
				Util.getUnitStatusCD();
				this.close();
			}
		}
	};

	dialog = Display.dialog( options );
	dialog.buttons.attr('disabled', true);

	$('.ig_deck_smallcardarea').contextMenu( Deck.dialog.contextmenu, true );
	$('#ig_deck_smallcardarea_out').contextMenu( Deck.dialog.contextmenu2, true );

	$('.imc_village').text( village.name );
	if ( coord ) {
		$('.imc_info8').val( coord );
	}

	enemylist = enemylist.filter(function( value ) {
		return ( value.ebase == village.name && value.arrival >= now );
	}).sort(function( a, b ) {
		return ( a.arrival > b.arrival );
	});

	if ( enemylist.length >= 1 ) {
		var $li = $('<li class="imc_enemy imc_countdown"><label>敵襲</label><span class="imc_countdown_display" /></li>');
		$li.data({ endtime: enemylist[ 0 ].arrival, alert: 120 });
		$('#imi_deck_info').append( $li );
		Util.countDown();
	}

	Deck.commandMenu( $('#imi_command_selecter') );
	Deck.dialog.loadCard( brigade ).done(function() {
		Deck.update();
		if ( coord ) {
			dialog.buttons.attr('disabled', false);
		}
		else {
			dialog.buttons.eq( 1 ).attr('disabled', false);
		}
	});
}

$.extend( Deck.dialog, {

//.. loaded
loaded: 0x00,

//.. loadCard
loadCard: function( brigade ) {
	var pageData = [], cardlist, cache;

	if ( brigade == 0 ) {
		cache = ( Deck.dialog.loaded == 0x3E );
	}
	else {
		cache = Deck.dialog.loaded & ( 0x01 << brigade );
	}

	if ( cache ) {
		$('#imi_info').hide();
		Deck.setup( Deck.freeCost, Deck.ano );

		cardlist = Deck.targetList();
		for ( var i = 0, len = cardlist.length; i < len; i++ ) {
			cardlist[ i ].element.removeClass('imc_selected');
			cardlist[ i ].element.appendTo('#ig_deck_smallcardarea_out');
		}

		return $.Deferred().resolve();
	}

	$('#imi_info').show();
	$('#ig_deck_smallcardarea_out').hide();
	$('<div id="imi_temporary" style="display: none;" />').appendTo('BODY');

	return $.post( '/card/deck.php', {
		target_card: '',
		select_assign_no: 4,
		mode: '',
		btn_change_flg: 1,
		set_village_id: '',
		set_assign_id: '',
		set_squad_id: '',
		deck_mode: 'nomal',
		p: 1,
		myselect2: '',
		select_card_group: brigade,
//		'sort_order[]': [ 1, 0, 0 ],
//		'sort_order_type[]': [ 0, 0, 0 ],
		show_deck_card_count: 15
	})
	.pipe(function( html ) {
		var $html = $( html.replace(/"http:\/\/.*(png|gif|jpg)"/g, '""') ),
			$card_list = $html.find('#ig_deck_smallcardarea_out').find('.ig_deck_smallcardarea'),
			$pager = $html.find('UL.pager.cardstock:first'),
			source = $pager.find('LI.last A:eq(1)').attr('onClick') || '',
			match = source.match(/input.name = "p"; input.value = "(\d+)"/),
			deck_cost, free_cost, ano, lastPage;

		//デッキ関係の情報保存
		deck_cost = $html.find('#ig_deckcost SPAN.ig_deckcostdata').text().match(/(\d+\.?\d?)\/(\d+)/);
		free_cost = deck_cost[2].toFloat() - deck_cost[1].toFloat();
		ano = 5 - $html.find('#ig_unitchoice LI:contains("[---新規部隊を作成---]")').length;

		if ( Deck.dialog.loaded == 0x00 ) {
			Deck.setup( free_cost, ano );
		}

		$('#imi_temporary').append( $html.find('#ig_boxInner > DIV[id^=cardWindow_]') );
		pageData.push( $card_list );

		if ( match ) {
			lastPage = match[1].toInt();
		}
		else {
			lastPage = 1;
		}

		return [ 2, lastPage ];
	})
	.pipe(function( param ) {
		var self = arguments.callee,
			[ next, lastPage ] = param,
			tasks = new Array(5);

		if ( next > lastPage ) { return; }

		for ( var i = 0; next <= lastPage && i < 3; next++, i++ ) {
			tasks[ i ] = $.get( '/card/deck.php', { myselect: '', ano: 4, dmo: 'normal', select_card_group: brigade, p: next });
		}

		return $.when.apply( $, tasks )
		.pipe(function() {
			for ( var i = 0, len = arguments.length; i < len; i++ ) {
				if ( !arguments[ i ] ) { continue; }

				let jqXHR = arguments[ i ][ 2 ],
					$html = $( jqXHR.responseText.replace(/"http:\/\/[^"]*(png|gif|jpg)"/g, '""') ),
					$card_list = $html.find('#ig_deck_smallcardarea_out').find('.ig_deck_smallcardarea');

				$('#imi_temporary').append( $html.find('#ig_boxInner > DIV[id^=cardWindow_]') );
				pageData.push( $card_list );
			}

			return self.call( self, [ next, lastPage ] );
		});
	})
	.pipe(function() {
		var cardlist;

		for ( var i = 0, len = pageData.length; i < len; i++ ) {
			MiniCard.setup( pageData[ i ] );
			pageData[ i ].appendTo('#ig_deck_smallcardarea_out');
		}

		$('#imi_info').hide();
		$('#ig_deck_smallcardarea_out').show();

		if ( brigade == 0 ) {
			Deck.dialog.loaded = 0x3E;
		}
		else {
			Deck.dialog.loaded |= 0x01 << brigade;
		}
	})
	.always(function() {
		$('#imi_temporary').remove();
	});
},

//.. contextmenu
contextmenu: function() {
	var $this = $(this),
		card_id = $this.attr('card_id'),
		card = Deck.analyzedData[ card_id ],
		data = Deck.getPoolSoldiers(),
		menu = {}, pool = [], submenu, num;

	menu[ card.name ] = $.contextMenu.title;

	//出品中
	if ( card.isExhibited ) {
		menu['出品中です'] = $.contextMenu.nothing;
		return menu;
	}

	if ( card.solType ) {
		num = data.pool[ card.solType ] || 0;
		submenu = {};

		if ( num > 0 && card.solNum > 0 && card.solNum < card.maxSolNum ) {
			submenu['最大補充'] = function() {
				card.setUnitMax()
				.done( Deck.update )
				.fail(function() { Display.alert('編成できませんでした。'); });
			};
		}

		[ 1, 10, 250, 500 ].forEach(function( value ) {
			if ( value >= num + card.solNum ) { return; }

			submenu[ '兵数 ' + value + ' セット' ] = function() {
				card.setUnit( value )
				.done( Deck.update )
				.fail(function() { Display.alert('編成できませんでした。'); });
			};
		});

		if ( card.solNum > 100 ) {
			submenu['セパレーター'] = $.contextMenu.separator;
			submenu['兵数 100 減らす'] = function() {
				card.setUnit( card.solNum - 100 )
				.done( Deck.update )
				.fail(function() { Display.alert('編成できませんでした。'); });
			};
		}

		if ( $.isEmptyObject( submenu ) ) {
			menu['兵数変更'] = $.contextMenu.nothing;
		}
		else {
			menu['兵数変更'] = submenu;
		}
	}
	else {
		menu['兵数変更'] = $.contextMenu.nothing;
	}

	$.each( Soldier.typeKeys, function( type ) {
		var poolnum = data.pool[ type ] || 0;

		if ( type == card.solType ) { return; }
		if ( poolnum == 0 ) { return; }

		pool.push({ type: type, name: '' + this, num: poolnum });
	});

	if ( pool.length > 0 ) {
		submenu = {};

		pool.forEach(function( poolSol ) {
			var menu = {}, base, max;

			base = Math.min( poolSol.num, card.solNum );
			max = Math.min( poolSol.num, card.maxSolNum );

			if ( max >= base ) {
				menu['兵数最大 ( ' + max + ' )'] = function() {
					card.setUnit( max, poolSol.type )
					.done( Deck.update )
					.fail(function() { Display.alert('編成できませんでした。'); });
				}
			}
			if ( base != max && base >= 2 ) {
				menu['現状維持 ( ' + base + ' )'] = function() {
					card.setUnit( base, poolSol.type )
					.done( Deck.update )
					.fail(function() { Display.alert('編成できませんでした。'); });
				}
			}
			menu['兵数 1'] = function() {
				card.setUnit( 1, poolSol.type )
				.done( Deck.update )
				.fail(function() { Display.alert('編成できませんでした。'); });
			}

			submenu[ poolSol.name + ' ( ' + poolSol.num + ' )' ] = menu;
		});

		menu['兵種変更'] = submenu;
	}
	else {
		menu['兵種変更'] = $.contextMenu.nothing;
	}

	menu['兵編成'] = function() { card.editUnit().done( Deck.update ); };
	menu['セパレーター1'] = $.contextMenu.separator;
	menu['リストから除外する'] = function() {
		Deck.filter.exceptions[ card_id ] = true;
		card.element.hide();
	};
	menu['セパレーター2'] = $.contextMenu.separator;

	var condition = Deck.filter.conditions[ 0 ] || [,[]],
		deck = $this.closest('#imi_card_container').length,
		list = $this.closest('#ig_deck_smallcardarea_out').length,
		batch = 0;

	if ( condition[ 0 ] == 'soltype' ) {
		if ( $.isArray( condition[ 1 ] ) ) {
			batch = ( condition[ 1 ].length == 1 ) ? 2 : 0;
		}
		else if ( condition[ 1 ] == 'none' ) {
			batch = 1;
		}
	}

	if ( deck ) {
		submenu = {};
		submenu['兵数変更'] = $.contextMenu.title;
		submenu['最大補充'] = function() {
			var list = Deck.currentUnit.assignList;
			Deck.setUnitMax( list );
		};
		submenu['兵数 1 セット'] = function() {
			var list = Deck.currentUnit.assignList;
			Deck.setUnit( list, 1 );
		};

		[ 10, 100, 300 ].forEach(function( value ) {
			submenu['兵数 ' + value + ' セット'] = function() {
				var list = Deck.currentUnit.assignList;
				Deck.gatherSoldier( list, value );
			};
		});

		if ( pool.length > 0 ) {
			submenu['兵種変更'] = $.contextMenu.title;

			pool.forEach(function( poolSol ) {
				submenu[ poolSol.name + ' ( ' + poolSol.num + ' )' ] = {
					'兵数最大': function() {
						var list = Deck.currentUnit.assignList;
						Deck.setUnitMax( list, poolSol.type );
					},
					'兵数 1': function() {
						var list = Deck.currentUnit.assignList;
						Deck.setUnit( list, 1, poolSol.type );
					}
				};
			});
		}

		menu['選択中の武将'] = submenu;
	}
	else if ( list && batch >= 1 ) {
		submenu = {};

		if ( batch == 2 ) {
			submenu['兵数変更'] = $.contextMenu.title;
			submenu['兵寄せ'] = function() {
				var list = Deck.targetList();
				Deck.gatherSoldierMax( list );
			};
			submenu['最大補充'] = function() {
				var list = Deck.targetList();
				Deck.setUnitMax( list );
			};
			submenu['兵数 1 セット'] = function() {
				var list = Deck.targetList();
				Deck.setUnit( list, 1 );
			};
		}

		if ( pool.length > 0 ) {
			submenu['兵種変更'] = $.contextMenu.title;

			pool.forEach(function( poolSol ) {
				submenu[ poolSol.name + ' ( ' + poolSol.num + ' )' ] = {
					'兵数最大': function() {
						var list = Deck.targetList();
						Deck.setUnitMax( list, poolSol.type );
					},
					'兵数 1': function() {
						var list = Deck.targetList();
						Deck.setUnit( list, 1, poolSol.type );
					}
				};
			});
		}

		if ( $.isEmptyObject( submenu ) ) {
			menu['表示中の武将'] = $.contextMenu.nothing;
		}
		else {
			menu['表示中の武将'] = submenu;
		}
	}

	if ( Deck.dialog.loaded ^ 0x3F ) {
		var labellist = [ '', '【第一組】', '【第二組】', '【第三組】', '【第四組】', '【未設定】' ];

		submenu = {};
		for ( var i = 1; i <= 5; i++ ) {
			if ( Deck.dialog.loaded & ( 0x01 << i ) ) {
				submenu[ labellist[ i ] ] = $.contextMenu.nothing;
			}
			else {
				let brigade = i;
				submenu[ labellist[ i ] ] = function() {
					Deck.dialog.loadCard( brigade ).done( Deck.update );
				};
			}
		}

		menu['組データ追加読込'] = submenu;
	}
	else {
		menu['組データ追加読込'] = $.contextMenu.nothing;
	}

	return menu;
},

//.. contextmenu2
contextmenu2: function() {
	var menu = {};

	menu['デッキメニュー'] = $.contextMenu.title;

	if ( Deck.dialog.loaded ^ 0x3F ) {
		var labellist = [ '', '【第一組】', '【第二組】', '【第三組】', '【第四組】', '【未設定】' ];

		submenu = {};
		for ( var i = 1; i <= 5; i++ ) {
			if ( Deck.dialog.loaded & ( 0x01 << i ) ) {
				submenu[ labellist[ i ] ] = $.contextMenu.nothing;
			}
			else {
				let brigade = i;
				submenu[ labellist[ i ] ] = function() {
					Deck.dialog.loadCard( brigade ).done( Deck.update );
				};
			}
		}

		menu['組データ追加読込'] = submenu;
	}
	else {
		menu['組データ追加読込'] = $.contextMenu.nothing;
	}

	return menu;
}

});

//■ Unit
var Unit = function( card_list ) {
	this.list = card_list || [];
	this.assignList = [];

	this.update();

	return this;
}

//. Unit.prototype
$.extend( Unit.prototype, {

//.. update
update: function() {
	var cost = 0, atk = 0, def = 0, des = 0, speed = 0,
		list = this.list.concat( this.assignList );

	for ( var i = 0, len = list.length; i < len; i++ ) {
		let card = list[ i ];

		cost += card.cost;
		atk += card.totalAtk;
		def += card.totalDef;
		des += card.totalDes;
	}

	this.card = list.length;
	this.cost = cost;
	this.atk = atk;
	this.def = def;
	this.des = des;
	this.speed = Util.getSpeed( list );
},

//.. addCard
addCard: function( card ) {
	var list = this.list.concat( this.assignList );

	if ( this.card >= 4 ) {
		Display.alert('武将枠に空きが在りません。');
		return false;
	}

	if ( this.cost + card.cost > Deck.freeCost ) {
		Display.alert('デッキコストが足りません。');
		return false;
	}

	for ( var i = 0, len = list.length; i < len; i++ ) {
		if ( card.name == list[ i ].name ) {
			Display.alert('武将名が重複しています。');
			return false;
		}
	}

	this.assignList.push( card );
	this.update();

	return true;
},

//.. removeCard
removeCard: function( card ) {
	this.assignList = this.assignList.filter(function( elem, idx, array ) {
		return ( elem.cardId != this.cardId );
	}, card);

	this.update();
},

//.. assignCard
assignCard: function( village_id, unit_id ) {
	village_id = village_id || '';
	unit_id = unit_id || '';

	if ( !village_id && !unit_id ) { return; }
	if ( this.assignList.length == 0 ) {
		Display.alert('武将が選択されていません');
		return $.Deferred().reject();
	}

	var ol = Display.dialog(),
		list = [].concat( this.assignList ),
		retry = 0;

	if ( unit_id ) {
		ol.message('選択中の部隊に登録します。');
	}
	else {
		ol.message('新規部隊を登録します。');
	}

	ol.message('登録処理開始...');

	return $.Deferred().resolve()
	.pipe(function() {
		if ( unit_id != '' ) { return unit_id; }

		//部隊長を登録し部隊IDを取得する
		var card = list.shift(),
			postData = getPostData( '', village_id, card );

		return $.post( '/card/deck.php', postData )
		.pipe(function( html ) {
			var $html = $(html),
				text = $html.find('#ig_deck_unititle P').text(),
				name = ( text.match(/\[(.+)\]/) || [,''] )[ 1 ],
				href = $html.find('#ig_deck_unititle A').attr('href') || '',
				unit_id = href.match(/unit_assign_id=(\d+)/),
				$li = $html.find('#ig_unitchoice LI'),
				idx, newidx;

			if ( name != card.name ) {
				if ( retry >= 1 || list.length == 0 ) {
					return $.Deferred().reject( ol );
				}

				ol.message('部隊IDの取得失敗').message('部隊ID再取得中...');

				idx = $li.index( $li.filter(':contains("' + card.name + '")') );
				newidx = $li.index( $li.filter(':contains("新規部隊")') );
				if ( idx == -1 ) { idx = newidx; }

				Deck.ano = idx;
				retry++;

				return $.get( '/card/deck.php?ano=' + idx ).pipe( arguments.callee );
			}
			else if ( unit_id == null ) {
				return $.Deferred().reject( ol );
			}

			return unit_id[ 1 ];
		});
	})
	.pipe(function( unit_id ) {
		var tasks;

		if ( list.length == 0 ) { return $.Deferred().resolve( ol ); }

		ol.message('部隊IDの取得成功');

		tasks = [ ol ];
		while ( list.length > 0 ) {
			let postData = getPostData( unit_id, '', list.shift() );
			tasks.push( $.post( '/card/deck.php', postData ) );
		}

		return $.when.apply( $, tasks );
	})
	.done(function() {
		ol.message('登録処理終了').message('ページを更新します...');
	})
	.fail(function() {
		ol.message('登録処理失敗').message('処理を中断します。');
	});

	function getPostData( unit_id, village_id, card ) {
		ol.message('「' + card.name + '」を登録中...');

		return {
			target_card: '',
			select_assign_no: Deck.ano,
			mode: 'assign_insert',
			btn_change_flg: '',
			set_village_id: village_id,
			set_assign_id: unit_id,
			set_card_id: card.cardId,
//			set_squad_id: card.squadId,
			set_squad_id: '',
			deck_mode: 'nomal',
			p: 1,
			myselect_2: ''
		};
	};
}

});

//■ Card
var Card = function() {};

//. Card
$.extend( Card, {

//.. unionData
// ランクアップ・スキル強化の追加カード：material_cid[]
unionData: {
	'sort_order[]': [ 0, 0, 0 ], 'sort_order_type[]': [ 0, 0, 0 ],
	show_deck_card_count: 15,
	base_cid: '', added_cid: '', add_flg: '', new_cid: '', remove_cid: '',
	p: '', selected_cid: '', deck_mode: '', union_type: '', btn_change_flg: ''
},

//.. getRarityByClassName
getRarityByClassName: function( className ) {
	return {
		'rarerity_1': '序',
		'rarerity_2': '上',
		'rarerity_3': '特',
		'rarerity_3_new': '特',
		'rarerity_4': '極',
		'rarerity_4_new': '極',
		'rarerity_5': '天',
		'rarerity_iwai': '祝',
		'rarerity_miyabi': '雅'
	}[ className ];
},

//.. unionLevelup
unionLevelup: function( type, card_id, added_cid, material ) {
	var data = $.extend( {}, Card.unionData );

	data.union_type = type;

	if ( added_cid ) {
		//素材カードが指定されている場合は、指定後の画面へ飛ばす
		data.base_cid = card_id;
		data.added_cid = added_cid;

		if ( $.isArray( material ) && material.length > 0 && material.length <= 5 ) {
			//追加素材ガードが指定されている場合はセット
			data['material_cid[]'] = material;
		}

		Page.form( '/union/union_levelup.php', data );
	}
	else {
		//素材カードが指定されていない場合は、指定する画面へ飛ばす
		data['selected_cid'] = card_id;
		Page.form( '/union/levelup.php', data );
	}
},

//.. rankup
rankup: function( card_id, added_cid, material_cid ) {
	Card.unionLevelup( 4, card_id, added_cid, material_cid );
},

//.. skillLevelup
skillLevelup: function( card_id, added_cid, material_cid ) {
	Card.unionLevelup( 1, card_id, added_cid, material_cid );
},

//.. skillAdd
skillAdd: function( card_id, added_cid ) {
	Card.unionLevelup( 2, card_id, added_cid, [] );
},

//.. skillRemove
skillRemove: function( card_id ) {
	var data = $.extend( {}, Card.unionData );

	data.base_cid = card_id;
	data.selected_cid = card_id;
	data.union_type = 3;

	Page.form( '/union/union_remove.php', data );
},

//.. exhibit
exhibit: function( card_id ) {
	Page.form( '/card/exhibit_confirm.php', { exhibit_cid: card_id });
	return;
/*
	$.post('/card/exhibit_confirm.php', { exhibit_cid: card_id })
	.done(function( html ) {
		//return $.post('/card/exhibit_confirm.php', { exhibit_cid: card_id, exhibit_price: 999999, exhibit_btn: '出品する' });
	})
	.done(function() {
		//location.href = '/card/exhibit_list.php';
	});
*/
},

//.. delete
delete: function( array ) {
	Page.form( '/card/deck_card_delete.php', {
		show_num: 100,
		p: 1,
		'delete_card_arr[]': array,
		btn_preview: 'チェックしたカードを破棄'
	});
}

});


//. Card.prototype
$.extend( Card.prototype, {

//.. status
name: '', rarity: '', secret: '',
cost: 0, rank: 0, lv: 0, hp: 100, maxHp: 100, solNum: 0, maxSolNum: 0,
solName: '', solType: null, atk: 0, def: 0, int: 0, commands: {}, skillList: [], skillCount: 0,
command: '', totalAtk: 0, totalDef: 0, totalDes: 0,
job: '', exp: 0,

//.. power
power: function() {
	var data = Soldier.getByName( this.solName ),
		mod  = Soldier.modify( this.solName, this.commands );

	if ( !data ) {
		this.solType = null;
		this.command = null;
		this.totalAtk = this.totalDef = this.totalDes = 0;
		return;
	}

	this.solType = data.type;
	//兵科
	this.command = data.command;
	//総攻撃力
	this.totalAtk = ( data.attack * this.solNum + this.atk ) * mod / 100;
	//総防御力
	this.totalDef = ( data.defend * this.solNum + this.def ) * mod / 100;
	//破壊力
	this.totalDes = ( data.destroy * this.solNum );
},

//.. match
match: function( conditions ) {
	var result = true;

	for ( var i = 0, len = conditions.length; i < len; i++ ) {
		let [ prop, value, option, convert ] = conditions[ i ],
			cardValue, maxprop, soltype;

		if ( prop == 'soltype' ) {
			if ( value == 'none' ) {
				//未編成
				result &= ( !this.solName );
			}
			else {
				soltype = this.solType;
				result &= value.some(function( classType, idx, array ) { return ( classType == soltype ); });
			}
		}
		else {
			if ( value == 'max' ) {
				maxprop = 'max' + prop[ 0 ].toUpperCase() + prop.slice( 1 );
				value = this[ maxprop ];
			}

			if ( convert ) {
				cardValue = convert( this );
			}
			else {
				cardValue = this[ prop ];
			}

			if ( option == 'gt' ) {
				result &= ( cardValue >= value );
			}
			else if ( option == 'lt' ) {
				result &= ( cardValue <= value );
			}
			else if ( option == 'ne' ) {
				result &= ( cardValue != value );
			}
			else {
				result &= ( cardValue == value );
			}
		}

		if ( !result ) { return result; }
	}

	return result;
},

//.. editUnit
editUnit: function() {
	var card = this,
		selected = card.element.hasClass('imc_selected'),
		card_soltype = card.solType || '',
		data = Deck.getPoolSoldiers(),
		dfd = $.Deferred(),
		list = {}, content = '';

	$.each( Soldier.typeKeys, function( type ) {
		var num = data.pool[ type ] || 0;

		//兵種が同じ場合、自身の兵数も加算
		if ( type == card_soltype ) { num += card.solNum; }
		if ( num == 0 ) { return; }

		list[ type ] = num;

		content += '<tr data-type="' + type + '" data-num="' + num + '">' +
			'<th>' + this + '</th><td>1</td>';

		[ 10, 250, 500 ].forEach(function( value ) {
			if ( num >= value && value <= card.maxSolNum ) {
				content += '<td>' + value + '</td>';
			}
			else {
				content += '<td class="imc_disabled">' + value + '</td>';
			}
		});

		if ( num >= card.maxSolNum ) {
			content += '<td>' + card.maxSolNum + '</td>';
		}
		else {
			content += '<td>' + num + '</td>';
		}

		content += '</tr>';
	});

	if ( !selected && card.solNum != 0 ) {
		content += '<tr data-type=""><th>解散</th><td colspan="5">0</td></tr>';
	}

	content = '' +
	'<table id="imi_unitedit" class="imc_table">' +
		'<tr><th>兵種</th><th colspan="5">兵数</th></tr>' + content +
	'</table>' +
	'<table class="imc_table" style="margin: 10px auto 0px auto;">' +
		'<tr><th id="imi_unitedit_type" style="width: 60px;"></th><td><input id="imi_unitedit_value" style="width: 50px; ime-mode: disabled;" maxlength="5"> / ' + card.maxSolNum + '</td></tr>' +
	'</table>';

	var $table = $( content );
	$table.find('#imi_unitedit_type').data({ type: card_soltype }).text( card.solName || '未編成' );
	$table.find('#imi_unitedit_value').val( card.solNum );
	$table.eq( 0 ).find('TD').not('.imc_disabled')
	.hover( Util.enter, Util.leave )
	.click(function() {
		var $this = $(this),
			name = $this.closest('TR').find('TH').text(),
			type = $this.closest('TR').data('type'),
			num  = $this.text().toInt();

		$('#imi_unitedit_type').data({ type: type }).text( name );
		$('#imi_unitedit_value').val( num );
	});

	Display.dialog({
		title: '兵編成「' + card.name + '」',
		content: $table,
		width: 400, height: 'auto',
		buttons: {
			'決定': function() {
				var self = this,
					type = $('#imi_unitedit_type').data('type'),
					val = $('#imi_unitedit_value').val(),
					num;

				if ( /\D/.test( val ) ) {
					Display.alert('数値を入力してください。');
					return;
				}

				num = val.toInt();

				if ( type == '' ) {
					//解除
					num = 0;
				}
				else if ( num == 0 ) {
					Display.alert('0以上を入力してください。');
					return;
				}

				if ( num > card.maxSolNum ) { num = card.maxSolNum; }
				if ( num > list[ type ] ) { num = list[ type ]; }

				if ( num == card.solNum && type == card_soltype ) {
					Display.info('変更はありません。');
					dfd.reject();
					self.close();
					return;
				}

				card.setUnit( num, type )
				.always(function() {
					dfd.resolve();
					self.close();
				});
			},
			'キャンセル': function() {
				dfd.reject();
				this.close();
			}
		}
	});

	return dfd;
},

//.. setUnit
setUnit: function( value, type ) {
	var card = this,
		card_id  = card.cardId,
		old_type = card.solType,
		old_num  = card.solNum,
		unit_type = ( type !== undefined ) ? type : card.solType,
		data = Deck.getPoolSoldiers();

	if ( unit_type === null ) { return $.Deferred().resolve(); }

	return $.post( '/facility/set_unit_list_if.php', { card_id: card_id, unit_type: unit_type, unit_count: value } )
	.pipe(function( html ) {
		var data = $.parseJSON( html );
		if ( data.result == "ok" ) {
			return $.Deferred().resolve();
		}
		else {
			return $.Deferred().reject( data.result );
		}
	})
	.pipe(function() {
		card.solNum = value;
		card.solName = Soldier.getNameByType( unit_type );
		card.solType = unit_type;
		card.power();
		card.update();

		//プールデータ更新
		if ( old_type ) { data.pool[ old_type ] += old_num; }
		if ( unit_type ) { data.pool[ unit_type ] -= value; }
	});
},

//.. setUnitMax
setUnitMax: function() {
	var card = this,
		data = Deck.getPoolSoldiers(),
		sol_num;

	sol_num = data.pool[ card.solType ] || 0;
	if ( sol_num == 0 ) { $.Deferred().reject(); }

	sol_num = card.solNum + sol_num;
	if ( sol_num > card.maxSolNum ) {
		sol_num = card.maxSolNum;
	}

	return card.setUnit( sol_num );
},

//.. getRecoveryTime
getRecoveryTime: function() {
	var time;

	if ( this.job == '剣' ) {
		time = ( this.rank * Data.hpRecovery['剣'][ 20 ] + Data.hpRecovery['剣'][ this.lv ] ) * 60;
	}
	else {
		time = ( 1 + this.lv / 4 + this.rank * 6 ) * Data.hpRecovery[ this.rarity ];
	}

	return Math.ceil( time * ( this.maxHp - this.hp ) / 100 );
},

//.. canAssign
canAssign: function() {
	return ( this.gounit == '1' && this.solNum > 0 );
},

//.. canUnion
canUnion: function() {
	return ( this.rarity !== '祝' && this.rarity !== '雅' && this.cardId !== undefined );
},

//.. useMaterial
useMaterial: function() {
	//追加素材専用
	if ( $.inArray( this.cardNo, [ 6002, 6003, 6004, 6005 ] ) != -1 ) {
		return true;
	}

	return this.canUnion();
},

//.. canRankup
canRankup: function() {
	return ( this.lv === 20 && this.rank < 5 );
},

//.. canSkillLvup
canSkillLvup: function() {
	return this.skillList.some(function( value ) {
		return ( value.lv < 10 );
	});
},

//.. canSkillAdd
canSkillAdd: function() {
	return ( this.skillCount < 3 );
},

//.. canSkillRemove
canSkillRemove: function() {
	return ( this.skillCount >= 2 );
},

//.. canExhibit
canExhibit: function() {
	return ( this.rarity !== '祝' && this.rarity !== '雅' && this.hp === this.maxHp && this.solNum === 0 );
}

});

//■ LargeCard
var LargeCard = function( element ) {
	var $elem = $( element );

	this.analyze( $elem );
	this.power();
}

//. LargeCard.prototype
$.extend( LargeCard.prototype, Card.prototype, {

//.. analyze
analyze: function( $elem ) {
	var $param = $elem.find('.parameta_area'),
		text, array;

	if ( $param.length == 0 ) {
		throw new Error('武将カード情報を取得できませんでした。');
	}

	//card_no
	this.cardNo = $param.find('.ig_card_cardno').text().toInt();

	//名前
	this.name = $param.find('.ig_card_name').text();
	//レア
	text = $param.children('SPAN').eq( 0 ).attr('class');
	this.rarity = Card.getRarityByClassName( text );
	this.secret = /_new/.test( text );
	//コスト ig_card_cost_overは大殿の饗宴用
	this.cost = $param.find('.ig_card_cost, .ig_card_cost_over').eq( 0 ).text().toFloat();
	//ランク・レベル
	text = $param.find('.bg_star').attr('width') || '0';
	this.rank = Math.round( text.match(/\d+/)[0].toInt() / 20 ); //画像の幅から算出
	this.lv = $param.find('.ig_card_level').text().toInt();

	array = $param.find('.ig_card_status_hp').text().split('/');
	this.hp = array[0].toInt(),
	this.maxHp = array[1].toInt();

	//スタイルシート名から兵種を求める
	text = $param.find('SPAN[class^="commandsol_"]').attr('class');
	this.solName = Soldier.getNameByClass( text );
	this.solType = Soldier.getType( this.solName );

	//指揮数 commandsol_no_overは大殿の饗宴用
	text = $param.find('.commandsol_no, .commandsol_no_over').eq( 0 ).text();
	array = text.split('/');
	this.solNum = array[0].toInt();
	this.maxSolNum = array[1].toInt();

	//攻撃力・防御力
	this.atk = $param.find('.ig_card_status_att').text().toInt();
	this.def = $param.find('.ig_card_status_def').text().toInt();
	this.int = $param.find('.ig_card_status_int').text().toFloat();

	//統率
	this.commands = {};
	this.commands['槍'] = $param.find('SPAN[class^="yari"]').attr('class').match(/lv_(\w+)/)[1].toUpperCase();
	this.commands['弓'] = $param.find('SPAN[class^="yumi"]').attr('class').match(/lv_(\w+)/)[1].toUpperCase();
	this.commands['馬'] = $param.find('SPAN[class^="kiba"]').attr('class').match(/lv_(\w+)/)[1].toUpperCase();
	this.commands['器'] = $param.find('SPAN[class^="heiki"]').attr('class').match(/lv_(\w+)/)[1].toUpperCase();

	//職業
	text = $elem.find('SPAN[class^="jobtype"], SPAN[class^="grayjobtype"]').attr('class').match(/jobtype_(\d)/)[1];
	this.job = [ '', '将', '剣', '忍', '文' ][ text.toInt() ] || '';
	//経験値
	this.exp = $elem.find('.ig_card_exp').text().toInt();

	//スキル
	this.skillList = $elem.find('.skill1, .skill2, .skill3').map(function() {
		var text = $(this).find('.ig_skill_name, .grayig_skill_name').text(),
			array = text.match(/(.+)LV(\d+)$/),
			deck, type;

		if ( !array ) {
			//レベルのないもの（感謝の饗宴、東西無双など）
			return { name: text, lv: 0 };
		}

		array[ 1 ] = array[ 1 ].trim().replace(/ +/g, ' ');

		deck = $(this).find('.ig_skill_desc').text();
		if ( deck.indexOf('速：') != -1 ) { type = '速'; }
		else if ( deck.indexOf('攻：') != -1 ) { type = '攻'; }
		else if ( deck.indexOf('防：') != -1 ) { type = '防'; }
		else { type = '特'; }

		return { name: array[ 1 ], lv: array[ 2 ].toInt(), type: type };
	}).get();
	this.skillCount = this.skillList.length;
	this.speedModify = (function() {
		var mod = {},
			speedReg = /速：(\d+(?:\.\d+)?)%上昇/;

		$elem.find('.skill1, .skill2, .skill3').each(function() {
			var $this = $(this),
				effect = ( $this.find('.ig_skill_desc').text().match( speedReg ) || [] )[1],
				targets = $this.find('.ig_skill_desc FONT').text(),
				target;

			if ( !effect ) { return; }

			targets = targets.split('');

			for ( var i = 0, len = targets.length; i < len; i++ ) {
				target = targets[ i ];

				if ( !mod[ target ] ) { mod[ target ] = 0; }
				mod[ target ] += effect.toFloat();
			}
		});

		return mod;
	})();

	//card_id
	text = $elem.find('[id^="card_commandsol_"]').attr('id');
	array = text.match(/(\d+)/);
	if ( array != null ) {
		this.cardId = array[1];
	}
}

});

//■ SmallCard
var SmallCard = function( element ) {
	var $elem = $( element );

	this.element = $elem;
	this.analyze();
	this.power();
	this.layouter();

	$elem.attr({ card_id: this.cardId });
}

//. SmallCard
$.extend( SmallCard, {

//.. setup
setup: function( $list ) {
	$list.each(function() {
		var card = new SmallCard( this );
		if ( card.cardId ) {
			Deck.analyzedData[ card.cardId ] = card;
		}
	});
}

});

//. SmallCard.prototype
$.extend( SmallCard.prototype, Card.prototype, {

//.. isExhibited
isExhibited: false,

//.. analyze
analyze: function() {
	var $elem = this.element,
		$card, $img, text, array;

	text = $elem.find('A').attr('href') || '';
	array = text.match(/cardWindow_(\d+)/);

	if ( !array ) { return; }

	$card = $('#cardWindow_' + array[ 1 ]);
	LargeCard.prototype.analyze.call( this, $card );

	//組
	text = $elem.find('.ig_deck_unitbox > DIV').attr('class');
	this.brigade = text.match(/unit_brigade(\d)/)[ 1 ].toInt();

	//「兵士編成」ボタンがある：編成・合成可、ボタンがない：出品中
	if ( $elem.find('IMG[alt="兵士編成"]').length == 0 ) {
		this.isExhibited = true;
	}

	//squad_id
	//「選択中の部隊へ」ボタンがある：部隊配置可
	$img = $elem.find('IMG[alt="選択中の部隊へ"]');
	text = $img.parent().addClass('imc_assign_button').attr('onClick') || '';
	array = text.match(/confirmRegist2\('\d*', '(\d+)'/);
	if ( array != null ) {
		this.squadId = array[ 1 ];
	}

	//gounit
	this.gounit = $elem.find('INPUT[id^="btn_gounit_flg_"]').val();

	//battle_gage
	this.battleGage = $elem.find('.ig_deck_battlepoint2').text().toInt();
},

//.. layouter
layouter: function() {
	var $elem = this.element,
		$div  = $elem.children('div'),
		$div1 = $div.eq( 1 ),
		$div2 = $div.eq( 2 ),
		$tables = $elem.find('.ig_deck_smallcarddata'),
		$table, html, cssClass, lvClass, next20, coverRate, endtime, $a, $input;

	//いらないものを削除してしまう
	$elem.find('.smallcard_bg, .smallcard_waku, .battlegage2, .ig_deck_smallcarddelete').remove();

	//スキル表示位置変更
	$table = $tables.eq( 2 );
	$table.addClass('imc_card_skill').prependTo( $elem.find('.ig_deck_smallcardbox') );
	//スキル背景色変更
	this.skillList.forEach(function( value, idx ) {
		var color = { '攻': '#058', '防': '#363', '速': '#535', '特': '#850' }[ value.type ] || 'transparent';
//		var color = { '攻': '#036', '防': '#250', '速': '#504', '特': '#850' }[ value.type ] || 'transparent';

		$table.find('TR').eq( idx ).css('background-color', color);
	});

	lvClass = ( this.lv == 20 ) ? 'imc_lv imc_lv_20' : 'imc_lv';
	next20 = Util.getNext20Exp( this.rank, this.exp );

	//コスト・ランク・レベルを表示
	html = '<span class="imc_cardname">' + this.name + '</span>' +
	'<span class="imc_card_header">' +
		'<span>' + this.cost + '｜</span>' +
		'<span style="color: red; font-weight: bold;">' + '★'.repeat( this.rank ) + '</span>' +
		'<span title="Lv20まで：' + next20 + '" >' + '☆'.repeat( 5 - this.rank ) + '｜Lv　</span><span class="' + lvClass + '">' + this.lv + '</span>' +
	'</span>';
	$elem.find('.ig_deck_smallcardtitle').html( html );

	//ステータス表示部
	if ( this.solNum == this.maxSolNum ) {
		//兵士満載の場合
		cssClass = 'class="imc_solmax"';
	}
	else if ( this.solNum > 0 ) {
		cssClass = 'class="emphasis"';
	}
	else {
		cssClass = '';
	}

	//指揮兵・兵種・総攻撃力・総防御力を表示
	html= '' +
	'<tr id="deck_unit_cnt_tr_' + this.cardId + '" ' + cssClass + '>' +
		'<th>指揮兵</th>' +
		'<td><span id="deck_unit_cnt_' + this.cardId + '">' + this.solNum + '</span>/' + this.maxSolNum + '</td>' +
	'</tr>' +
	'<tr id="deck_unit_type_tr_' + this.cardId + '" ' + cssClass + '>' +
		'<th>兵種</th>' +
		'<td id="deck_unit_type_' + this.cardId + '">' + ( this.solName || '' ) + '</td>' +
	'</tr>' +
	'<tr class="imc_power">' +
		'<th>総攻撃力</th>' +
		'<td>' + Math.floor( this.totalAtk ).toFormatNumber( '', '-' ) + '</td>' +
	'</tr>' +
	'<tr class="imc_power">' +
		'<th>総防御力</th>' +
		'<td>' + Math.floor( this.totalDef ).toFormatNumber( '', '-' ) + '</td>' +
	'</tr>';

	$tables.eq( 0 ).addClass('imc_card_status').html( html );

	if ( this.int >= 800 ) {
		$tables.eq( 1 ).find('TD').eq( 1 ).css('background-color', '#850');
	}

	html = '<div class="ig_deck_smallcarddataarea">';
	//討伐ゲージ表示
	coverRate = ( 100 - Math.floor( this.battleGage / 300 * 100 )) + '%';
	html += '<div class="imc_bar_title">討伐ゲージ： ' + this.battleGage + '</div>' +
			'<div class="imc_bar_battle_gage"><span class="imc_bar_inner" style="width: ' + coverRate + '" /></div>';
	//HPバー表示
	coverRate = ( 100 - Math.floor( this.hp / this.maxHp * 100 )) + '%';
	html += '<div class="imc_bar_title">HP： ' + this.hp + ' / ' + this.maxHp + '</div>' +
			'<div class="imc_bar_hp"><span class="imc_bar_inner" style="width: ' + coverRate + '" /></div>' +
		'</div>';

	$div1.append( html );

	//フッタ部
	//配置ボタンと編成ボタンを入れ替える
	$a = $div2.addClass('imc_button_container').find('A');
	$input = $div2.find('INPUT');
	if ( this.isExhibited ) {
		$div2.empty().append('出品中は兵編成できません');
	}
	else {
		$div2.empty().append( $a.get().reverse() );
	}
	$div2.append( $input );

	//HP回復時間を表示
	if ( this.hp < this.maxHp ) {
		endtime = Util.getServerTime() + this.getRecoveryTime();

		$('<div class="imc_recovery_time imc_countdown"/>')
		.data({ endtime: endtime, finishevent: 'recoveryfinish', message: '・' + this.name })
		.append('<span class="imc_countdown_display" /> 後全快')
		.appendTo( $div2 );
	}

	//微調整
	$div1.css({ marginBottom: '2px' });
	$div2.css({ height: '29px', lineHeight: '29px', marginBottom: '2px' });
},

//.. clone
clone: function() {
	var $clone = this.element.clone().show();

	$clone
	.find('.imc_button_container').remove().end()
	.find('.ranklvup_m').remove().end()
	.find('.smallcard_chara').unwrap().end();

	return $clone;
},

//.. update
update: function() {
	var $elem = this.element,
		$tr = $elem.find('.imc_card_status TR');

	if ( this.solNum == this.maxSolNum ) {
		$tr.slice( 0, 2 ).removeClass('emphasis').addClass('imc_solmax');
	}
	else if ( this.solNum > 0 ) {
		$tr.slice( 0, 2 ).addClass('emphasis').removeClass('imc_solmax');
	}
	else {
		$tr.slice( 0, 2 ).removeAttr('class');
	}

	$tr.find('#deck_unit_cnt_' + this.cardId).text( this.solNum );
	$tr.find('#deck_unit_type_' + this.cardId).text( this.solName || '' );
	$tr.eq( 2 ).find('TD').text( Math.floor( this.totalAtk ).toFormatNumber( '', '-' ) );
	$tr.eq( 3 ).find('TD').text( Math.floor( this.totalDef ).toFormatNumber( '', '-' ) );

	if ( this.canAssign() ) {
		$elem.removeClass('imc_disabled');
		$elem.find('.imc_assign_button').show();
	}
	else {
		$elem.addClass('imc_disabled');
		$elem.find('.imc_assign_button').hide();
	}
}

});

//■ MiniCard
var MiniCard = function( element ) {
	var $elem = $( element );

	this.element = $elem;
	this.analyze();
	this.power();
	this.layouter();

	if ( !this.canAssign() ) {
		$elem.addClass('imc_disabled');
	}

	$elem.attr({ card_id: this.cardId });
}

//. MiniCard
$.extend( MiniCard, {

//.. setup
setup: function( $list ) {
	$list.each(function() {
		var card = new MiniCard( this );
		if ( card.cardId ) {
			Deck.analyzedData[ card.cardId ] = card;
		}
	});
}

});

//. MiniCard.prototype
$.extend( MiniCard.prototype, SmallCard.prototype, {

//.. layouter
layouter: function() {
	var $elem = this.element,
		$tables = $elem.find('.ig_deck_smallcarddata'),
		$table, $div, html, color, cssClass, coverRate;

	//いらないものを削除してしまう
	//$elem.find('.smallcard_bg, .smallcard_waku, .battlegage2, .ig_deck_smallcarddelete, .ig_deck_smallcarddataarea, .ranklvup_m').remove();
	//$elem.find('.thickbox').remove();
	$elem.empty();

	//名前・コスト
	color = { '序': '#06c', '上': '#ff0', '特': '#c00', '極': '#666', '天': '#fff', '祝': '#f3c', '雅': '#c90' }[ this.rarity ];
	html = '' +
	'<div style="margin-bottom: 5px;"><span class="imc_card_header">' +
		'<span class="imc_cardname">' + this.name + '</span>' +
		'<span class="imc_rarity" style="color: ' + color + '">■</span>' +
		'<span class="imc_cost">' + this.cost + '</span>' +
	'</span></div>';
	$elem.append( html );

	//表示１
	$div = $('<div class="imc_status1"/>').appendTo( $elem );

	//ステータス表示部
	if ( this.solNum == this.maxSolNum ) {
		//兵士満載の場合
		cssClass = 'class="imc_solmax"';
	}
	else if ( this.solNum > 0 ) {
		cssClass = 'class="emphasis"';
	}
	else {
		cssClass = '';
	}

	//指揮兵・兵種・総攻撃力・総防御力を表示
	html= '' +
	'<table class="imc_card_status">' +
	'<tr id="deck_unit_cnt_tr_' + this.cardId + '" ' + cssClass + '>' +
		'<th>指揮兵</th>' +
		'<td><span id="deck_unit_cnt_' + this.cardId + '">' + this.solNum + '</span>/' + this.maxSolNum + '</td>' +
	'</tr>' +
	'<tr id="deck_unit_type_tr_' + this.cardId + '" ' + cssClass + '>' +
		'<th>兵種</th>' +
		'<td id="deck_unit_type_' + this.cardId + '">' + ( this.solName || '' ) + '</td>' +
	'</tr>' +
	'<tr class="imc_power">' +
		'<th>総攻撃力</th>' +
		'<td>' + Math.floor( this.totalAtk ).toFormatNumber( '', '-' ) + '</td>' +
	'</tr>' +
	'<tr class="imc_power">' +
		'<th>総防御力</th>' +
		'<td>' + Math.floor( this.totalDef ).toFormatNumber( '', '-' ) + '</td>' +
	'</tr>' +
	'</table>';

	$div.append( html );

	//スキル背景色変更
	$table = $tables.eq( 2 ).addClass('imc_card_skill');
	this.skillList.forEach(function( value, idx ) {
		var color = { '攻': '#058', '防': '#363', '速': '#535', '特': '#850' }[ value.type ] || 'transparent';
//		var color = { '攻': '#036', '防': '#250', '速': '#504', '特': '#850' }[ value.type ] || 'transparent';

		$table.find('TR').eq( idx ).css('background-color', color);
	});
	$div.append( $table );

	//表示２
	$div = $('<div class="imc_status2"/>').appendTo( $elem );

	html = '' +
	'<div style="margin-bottom: 3px; text-align: right;"><span class="imc_card_header">' +
		'<span class="imc_rank">' + '★'.repeat( this.rank ) + '</span>' +
		'<span class="imc_lv">' + '☆'.repeat( 5 - this.rank ) + '｜Lv　' + this.lv + '</span>' +
	'</span></div>';
	$div.append( html );

	$table = $tables.eq( 1 ).addClass('imc_card_param');
	if ( this.int >= 800 ) {
		$table.find('TD').eq( 1 ).css('background-color', '#850');
	}
	$div.append( $table );

	html = '<div class="ig_deck_smallcarddataarea">';
	//討伐ゲージ表示
	coverRate = ( 100 - Math.floor( this.battleGage / 300 * 100 )) + '%';
	html += '<div class="imc_bar_title">討伐ゲージ： ' + this.battleGage + '</div>' +
			'<div class="imc_bar_battle_gage"><span class="imc_bar_inner" style="width: ' + coverRate + '" /></div>';
	//HPバー表示
	coverRate = ( 100 - Math.floor( this.hp / this.maxHp * 100 )) + '%';
	html += '<div class="imc_bar_title">HP： ' + this.hp + ' / ' + this.maxHp + '</div>' +
			'<div class="imc_bar_hp"><span class="imc_bar_inner" style="width: ' + coverRate + '" /></div>' +
		'</div>';

	$div.append( html );
},

//.. clone
clone: function() {
	return this.element.clone().show();
}

});

//■ SideBar
var SideBar = {

//. init
init: function() {
	$('#sideboxBottom .basename').parent().attr('id', 'imi_basename');
},

//. setup
setup: function() {
	var $base = $('#imi_basename');

	$('DIV.basename:eq(0)').prev().css({ cursor: 'pointer' })
	.find('H4').append('<span style="float: right">設定</span>').end()
	.on('click', function() {
		var build = MetaStorage('SETTINGS').get('build') || 0,
			html;

		html = '' +
		'<div>カウントダウン表示</div>' +
		'<br/>' +
		'<ul id="imi_setting_dialog">' +
		'<li><label><input type="checkbox" value="8" ' + ( ( build & 0x08 ) ? 'checked' : '' ) + '> 敵襲</label></li>' +
		'<li><label><input type="checkbox" value="4" ' + ( ( build & 0x04 ) ? 'checked' : '' ) + '> 部隊</label></li>' +
		'<li><label><input type="checkbox" value="1" ' + ( ( build & 0x01 ) ? 'checked' : '' ) + '> 建設／研究</label></li>' +
		'<li><label><input type="checkbox" value="2" ' + ( ( build & 0x02 ) ? 'checked' : '' ) + '> 訓練</label></li>' +
		'</ul>';

		Display.dialog({
			title: 'サイドバー設定',
			width: 200, height: 100,
			content: html,
			buttons: {
				'決定': function() {
					var result = 0;

					$('#imi_setting_dialog INPUT:checked').each(function() {
						result += $(this).val().toInt();
					});

					MetaStorage('SETTINGS').set('build', result);

					if ( ( build ^ result ) & result & 0x04 ) {
						Util.getUnitStatus();
					}
					else {
						$('#imi_basename').trigger('update');
					}
					this.close();
				},
				'キャンセル': function() { this.close(); }
			}
		});
	});

	$base
	.on('update', function() {
		var build = MetaStorage('SETTINGS').get('build') || 0;

		$('#imi_basename LI.imc_enemy').removeClass('imc_enemy');
		$('#imi_basename').find('.imc_other, .imc_side_countdown').remove();

		if ( build & 0x08 ) { SideBar.countDown('敵襲'); }
		if ( build & 0x04 ) { SideBar.countDown('部隊'); }
		if ( build & 0x01 ) { SideBar.countDown('建設'); }
		if ( build & 0x01 ) { SideBar.countDown('削除'); }
		if ( build & 0x02 ) { SideBar.countDown('訓練'); }

		Util.countDown();
	});

	$base.trigger('update');
},

//. countDown
countDown: function( type ) {
	var cd_list = SideBar.load( type ),
		date = Util.getServerTime(),
		classlist = {
			'攻撃': 'imc_attack', '陣張': 'imc_camp', '合流': 'imc_meeting',
			'加勢': 'imc_backup', '帰還': 'imc_return', '探索': 'imc_dungeon',
			'開拓': 'imc_develop', '国移': 'imc_move', '待機': 'imc_wait', '加待': 'imc_backup_wait'
		};

	$.each( cd_list, function( key, list ) {
		var $base = $('#imi_basename LI > *').filter(function() { return ( $(this).text() == key ); }),
			$other = $('.imc_other');

		if ( $base.length == 0 ) {
			if ( $other.length == 0 ) {
				$other = $('<div class="imc_other">' +
					'<div class="sideBoxHead"><h4>その他</h4></div>' +
					'<div class="sideBoxInner basename"><ul /></div></div>');
				$('#imi_basename > .basename').first().prev().before( $other );
			}

			$base = $('<li><span>' + key + '</span></li>');
			$other.find('UL').append( $base );
		}
		else {
			$base = $base.parent();
		}

		list.sort(function( a, b ) {
			return ( a[ 0 ] > b[ 0 ] );
		});

		for ( var i = 0, len = list.length; i < len; i++ ) {
			let [ endtime, label, mode, x, y, c ] = list[ i ],
				html, $div, finishevent, message, cssClass;

			cssClass = classlist[ mode ] || '';
			html = '<div class="imc_countdown imc_side_countdown"><span class="' + cssClass + '">' +
				label + '</span>(<span class="imc_countdown_display" />)' +
			'</div>';

			$div = $( html );

			if ( type == '敵襲' ) {
				$div.addClass('imc_enemy');
//				$base.addClass('imc_enemy');
				finishevent = 'actionrefresh';
			}
			else if ( type == '部隊' && ( mode == '待機' || mode == '加待' ) ) {
				$div.css({ padding: '2px 0px' }).removeClass('imc_countdown');
				$div.find('.imc_countdown_display').removeAttr('class').text( ' ' + mode + ' ' );

				if ( mode == '加待' ) {
					$base.children('SPAN').first().addClass('imc_coord').attr({ x: x, y: y, c: c });
				}
			}
			else if ( type == '部隊' && location.pathname != '/map.php' ) {
				$div.css({ padding: '2px 0px' });
				if ( endtime <= date ) {
					$div.find('.imc_countdown_display').removeAttr('class').text('--:--:--');
					endtime = date + 7;
					finishevent = 'actionrefresh';
				}
				else {
					finishevent = 'actionfinish';
				}
				message = '・[' + label + ']部隊';
			}
			else if ( type == '部隊' ) {
				$div.css({ padding: '2px 0px' });
				if ( endtime <= date ) {
					$div.find('.imc_countdown_display').removeAttr('class').text('--:--:--');
				}
			}
			else if ( type == '建設' ) {
				finishevent = 'buildfinish';
				message = '・' + key;
			}
			else if ( type == '削除' ) {
				$div.addClass('imc_break');
				finishevent = 'breakfinish';
				message = '・' + key;
			}
			else if ( type == '訓練' ) {
				finishevent = 'trainingfinish';
				message = '・' + key;
			}

			$div.data({ endtime: endtime, alert: 60, finishevent: finishevent, message: message });
			$base.append( $div );
		}
	});
},

//. load
load: function( type ) {
	if ( type == '部隊') {
		return SideBar.loadUnit();
	}
	else if ( type == '敵襲' ) {
		return SideBar.loadEnemy();
	}

	return SideBar.loadFacility( type );
},

//. loadUnit
loadUnit: function() {
	var list = MetaStorage('UNIT_STATUS').get('部隊') || [],
		result = {};

	for( var i = 0, len = list.length; i < len; i++ ) {
		let base = list[ i ],
			basename = ( base.mode == '加待' ) ? base.target : base.base;

		if ( !result[ basename ] ) { result[ basename ] = []; }
		result[ basename ].push([ base.arrival, base.name, base.mode, base.ex, base.ey, base.ec ]);
	}

	return result;
},

//. loadEnemy
loadEnemy: function() {
	var list = MetaStorage('UNIT_STATUS').get('敵襲') || [],
		result = {};

	for( var i = 0, len = list.length; i < len; i++ ) {
		let base = list[ i ];

		if ( base.type == '領地' ) { continue; }

		if ( !result[ base.ebase ] ) { result[ base.ebase ] = []; }
		result[ base.ebase ].push([ base.arrival, '■ 敵 襲 ■' ]);
	}

	return result;
},

//. loadFacility
loadFacility: function( type ) {
	var date = Util.getServerTime(),
		data = MetaStorage('COUNTDOWN').get( type ) || {},
		baselist = BaseList.home_away(),
		newdata = {}, result  = {};

	if ( baselist.length == 0 ) {
		return result;
	}

	//日時が現在時刻より過去の場合は削除する
	$.each( baselist, function() {
		var id = this.id;

		if ( !data[ id ] ) { return; }

		var newlist = [];
		data[ id ].forEach(function( v ) {
			if ( v[0] <= date ) { return; }
			newlist.push( v );
		});

		if ( newlist.length > 0 ) {
			newdata[ id ] = newlist;
			result[ this.name ] = newlist;
		}
	});

	MetaStorage('COUNTDOWN').set( type, newdata );

	return result;
}

};

//■ BaseList
var BaseList = (function() {

//. base
function base( country ) {
	var list = [],
		colors = { '本領': '#f80', '所領': '#0f0', '出城': '#f0f', '陣': '#0ff' };

	$('#imi_basename > .basename LI > *:first-child').each(function() {
		var name = $(this).text().trim(),
			village = Util.getVillageByName( name );

		if ( !village ) { return; }
		if ( village.country != country ) { return; }

		if ( colors[ village.type ] ) {
			list.push({ type: 0, id: village.id, name: name, x: village.x, y: village.y, color: colors[ village.type ] });
		}
	});

	return list;
}

//. home
function home() {
	var list = [];

	$('#imi_basename > .basename:eq(0) LI > *:first-child').each(function() {
		var name = $(this).text().trim(),
			village = Util.getVillageByName( name );

		if ( !village ) { return; }

		list.push({ type: 0, id: village.id, name: name, x: village.x, y: village.y, color: '#0f0' });
	});

	return list;
}

//. away
function away() {
	var list = [];

	$('#imi_basename > .basename:eq(1) LI > *:first-child').each(function() {
		var name = $(this).text().trim(),
			village = Util.getVillageByName( name );

		if ( !village ) { return; }

		list.push({ type: 0, id: village.id, name: name, x: village.x, y: village.y, color: '#0f0' });
	});

	return list;
}

//. coords
function coords( country ) {
	var list = [],
		map_list = MetaStorage('COORD.' + country).data;

	for ( var key in map_list ) {
		var point = key.match(/(-?\d+),(-?\d+)/),
			x = point[1].toInt(),
			y = point[2].toInt();

		list.push({ type: 2, id: null, name: map_list[key], x: x, y: y, color: '#ff0' });
	}

	return list;
}

//. return
return {
	all: function( country ) {
		var list = [];
		list = $.merge( list, base( country ) );
		return list;
	},
	home: home,
	home_away: function() {
		var list = [];
		list = $.merge( list, home() );
		list = $.merge( list, away() );
		return list;
	}
};

})();

//■■■■■■■■■■■■■■■■■■■

//■ Page
var Page = function() {
	var path = arguments[0],
		key  = '/' + path.join('/'),
		actionList = Page.actionList,
		extentionList = Page.extentionList,
		action;

	if ( Env.loginState == -1 ) {
		return new Page.noaction();
	}
	else if ( Env.loginState == 0 ) {
		action = new Page.action();
	}
	else {
		action = new Page.pageaction();
	}

	if ( actionList[ key ] ) {
		$.extend( action, actionList[ key ] );
	}

	if ( extentionList[ key ] ) {
		action.callbacks = extentionList[ key ];
	}

	return action;
};

//. Page
$.extend( Page, {

//.. actionList
actionList: {},

//.. extentionList
extentionList: {},

//.. registerAction
registerAction: function() {
	var args = Array.prototype.slice.call( arguments ),
		obj  = args.pop(),
		key  = '/' + args.join('/'),
		list = this.actionList;

	if ( list[ key ] ) {
		$.extend( list[ key ], obj );
	}
	else {
		list[ key ] = obj;
	}
},

//.. getAction
getAction: function() {
	var args = Array.prototype.slice.call( arguments ),
		action = args.pop(),
		key  = '/' + args.join('/'),
		list = this.actionList;

	if ( list[ key ] && list[ key ][ action ] ) {
		return list[ key ][ action ];
	}
	else {
		return $.noop;
	}
},

//.. registerExtention
registerExtention: function() {
	var args = Array.prototype.slice.call( arguments ),
		obj  = args.pop(),
		list = this.extentionList;

	if ( !$.isFunction( obj ) ) { return; }

	args.forEach(function( key ) {
		var callbacks;

		if ( list[ key ] ) {
			callbacks = list[ key ];
		}
		else {
			list[ key ] = callbacks = $.Callbacks();
		}

		callbacks.add( obj );
	});
},

//.. form
form: function( action, data ) {
	var $form = $('<form/>').css('display', 'none').attr({ action: action, method: 'post' });

	$.each( data, function( key, value ) {
		if ( $.isArray( value ) ) {
			$.each( value, function( idx, value2 ) {
				value2 = ( value2 === null || value2 === undefined ) ? '' : value2;
				$form.append( $('<input/>').attr({ name: key, value: value2 }) );
			})
		}
		else {
			value = ( value === null || value === undefined ) ? '' : value;
			$form.append( $('<input/>').attr({ name: key, value: value }) );
		}
	});

	$form.appendTo( document.body ).submit();
},

//.. ajax
ajax: function( url, options ) {
	return $.ajax( url, options )
	.pipe(function( html ) {
		var $html = $( html );

		if ( $html.find('img[alt="セッションタイムアウト"]').length > 0 ) {
			Display.alert('セッションタイムアウトしました。');
			return $.Deferred().reject();
		}
		else if ( $html.find('TITLE').text().indexOf('メンテナンス中') >= 0 ) {
			Display.alert('メンテナンス中です。');
			return $.Deferred().reject();
		}

		//移動状況を置き換える
		$('TABLE.stateTable').replaceWith( $html.find('TABLE.stateTable') );

		return html;
	});
},

//.. get
get: function( url, data ) {
	return Page.ajax( url, { type: 'get', data: data });
},

//.. post
post: function( url, data ) {
	return Page.ajax( url, { type: 'post', data: data });
},

//.. move
move: function( url ) {
	setTimeout( function() { location.href = url; }, 1000 );
},

//.. action
action: function() {},

//.. pageaction
pageaction: function() {},

//.. noaction
noaction: function() {}

});

//. Page.action.prototype
$.extend( Page.action.prototype, {

//.. execute
execute: function() {
	this.addStyle();
	this.main();
},

//.. addStyle
addStyle: function() {
	var style = Data.style;

	if ( this.style ) {
		style += this.style;
	}

	GM_addStyle( style );
},

//.. main
main: function() {}

});

//. Page.pageaction.prototype
$.extend( Page.pageaction.prototype, {

//.. execute
execute: function() {
	this.addStyle();
	this.ajaxLoadingIcon();
	this.changeTitle();
	this.changeStatusBar();
	this.changeSideBar();
	this.changeChatLink();
	this.createCoordLink();
	this.switchCardParameter();
	this.showTimeoutTimer();

	SideBar.init();

	this.main();
	if ( this.callbacks ) {
		this.callbacks.fire();
	}

	this.escapeSpecialCharacters();
	this.createPulldownMenu();

	Util.keyBindCommon();
	SideBar.setup();
},

//.. addStyle
addStyle: function() {
	var style = Data.style;

	if ( this.style ) {
		style += this.style;
	}

	GM_addStyle( style );
},

//.. ajaxLoadingIcon
ajaxLoadingIcon: function() {
	$('<span class="imc_ajax_load" style="display: none;" />')
	.append(
		$('<img />').attr({ src: Data.images.ajax_load })
	)
	.appendTo('BODY')
	.on('ajaxStart', function() {
		$(this).show();
	})
	.on('ajaxStop', function() {
		$(this).hide();
	});
},

//.. changeTitle
changeTitle: function() {
	if ( Env.world ) {
		$('TITLE').text( '【' + Env.world + '】' + $('TITLE').text() );
	}
},

//.. changeStatusBar
changeStatusBar: function() {
	//テキストノードを置き換えて、selecterで引っかかるようにする
	$('#status_left LI').contents().filter(function() { return this.nodeType == 3 && this.nodeValue.trim() != ''; }).wrap('<span/>');

	//蔵容量のバー表示
	'wood stone iron rice'.split(' ').forEach(function( value ) {
		var val = $( '#' + value ).removeAttr('class').text().toInt(),
			max_val = $( '#' + value + '_max' ).text().toInt(),
			out_val = $( '#output_' + value ).text().toInt(),
			rate = Math.floor( val / max_val * 100 ) + '%',
			period = ( max_val - val ) / out_val,
			html_outer, html_inner;

		if ( period < 3 ) {
			html_outer = '<span class="imc_outer_bar imc_overflow" />';
		}
		else if ( period < 8 ) {
			html_outer = '<span class="imc_outer_bar imc_alert" />';
		}
		else {
			html_outer = '<span class="imc_outer_bar" />';
		}

		html_inner += '<span class="imc_inner_bar imc_' + value + '" style="width: ' + rate + '" />';

		$( '#' + value ).parent().children().not('IMG')
		.wrapAll( html_outer ).wrapAll( html_inner ).wrapAll('<span class="imc_bar_contents" />');
	});

	//幅確保の為、セパレータをいくつか削除
	$('#status_left').find('.sep').text('|').slice( 0, 4 ).remove();

	var $clone, html;

	//銅と金のクローン作製
	$clone = $('#sideboxTop > DIV.sideBox:eq(0)').find('.substatus SPAN').clone().wrapAll('<li class="sep"/>').parent();

	html = '<li class="sep">' +
		'<a href="/facility/unit_status.php?dmo=all">全部隊</a>' +
		'<span>&nbsp;</span>' +
		'<a href="/facility/set_unit_list.php?show_num=100">全編成</a>' +
	'</li>';

	//メニュー追加
	$('#status_left UL').append( $clone ).append( html );
	$('#status').prependTo('#header');

	//IXA占い
	$('#status .rightF').css('padding-right', '3px').appendTo('#status_left')
		.children('P')
			.filter(':even').remove().end()
		.css('padding', '0px').end()
	.wrapAll('<a href="/user/uranai/uranai.php"/>');
},

//.. changeSideBar
changeSideBar: function() {
	var $sideboxtop_div = $('#sideboxTop > DIV.sideBox'),
		$sidebottom = $('#sideboxBottom'),
		$sidebottom_div = $sidebottom.children('DIV.sideBox'),
		$kin_div  = $sideboxtop_div.eq( 0 ).addClass('last'),
		$card_div = $sideboxtop_div.eq( 1 ),
		$joutai_div = $sideboxtop_div.eq( 2 ),
		$seisan_div = $sidebottom_div.eq( 0 ),
		$kyoten_div = $sidebottom_div.eq( 1 ),
		$houkoku_div = $sidebottom_div.eq( 2 ).removeClass('last');

	//二重カウントダウン防止
	$houkoku_div.find('SCRIPT').remove();
	$sidebottom.prepend( $houkoku_div ).append( $card_div ).append( $seisan_div ).append( $kin_div );

	//生産量合計
	$seisan_div.find('UL.side_make LI').each(function() {
		var $this = $(this),
			make = $this.text().toInt() + $this.find('SPAN.increase, SPAN.decrease').text().toInt();

		$this.after('<li style="padding-left: 25px; color: #0c0;">=' + make + '</li>');
	});

	//取引のソート指定
	$card_div.find('A[href="/card/trade.php"]').attr('href', '/card/trade.php?t=name&k=&s=no&o=a');
	//カードアルバム
	$card_div.find('A[href="/card/card_album.php"]').attr('href', '/card/card_album.php?rarity_type=3');

	//合戦ボタン削除
	$('.situationWorldTable').has('A[href="/war/war_situation.php"]').remove();
	$('.situationWorldTable').has('A[href="/country/all.php"]').remove();
	//占いボタン削除
	$('.situationBtnTable').has('A[href="/user/uranai/uranai.php"]').remove();

	$joutai_div.children('.sideBoxHead').css({ height: '25px' }).empty().append( $('.stateTable') );
},

//.. changeChatLink
changeChatLink: function() {
	$('#header DIV.commentbtn2 A:eq(1)').attr('href', '/alliance/chat_view.php?pager_select=100');
},

//.. createCoordLink
createCoordLink: function() {
	var coordReg = /-?\d{1,3}[，,.]\s*-?\d{1,3}/g,
		pointReg = /-?\d{1,3}/g,
		point, html;

	$('#commentBody TD.msg > SPAN').each(function() {
		var $this = $(this),
			text = $this.text(),
			array = text.match( coordReg );

		if ( !array ) { return; }

		for ( var i = 0, len = array.length; i < len; i++ ) {
			point = array[ i ].match( pointReg );
			html = '<span class="imc_coord" x="' + point[0] + '" y="' + point[1] + '">' + array[ i ] + '</span>';
			text = text.replace( array[ i ], html );
			$this.html( text );
		}
	});

	$('.imc_coord').live('click', function() {
		var $this = $(this),
			x = $this.attr('x'),
			y = $this.attr('y'),
			c = $this.attr('c') || '';

			Map.move( x, y, c );
	})
	.live('mouseenter', function() {
		var $this = $(this),
			x = $this.attr('x'),
			y = $this.attr('y'),
			areaid = 'imi_area_' + x + '_' + y;

		$('#' + areaid).mouseover();
	})
	.live('mouseleave', function() {
		var $this = $(this),
			x = $this.attr('x'),
			y = $this.attr('y'),
			areaid = 'imi_area_' + x + '_' + y;

		$('#' + areaid).mouseout();
	});
},

//.. switchCardParameter
switchCardParameter: function() {
	$('#TB_ajaxContent .ig_card_cardStatusFront').live('click', function() {
		var $elem = $(this).find('.ig_card_parameta, .parameta_area, .ig_card_frame'),
			len = $elem.filter(':visible').length;

		if ( len == 3 ) {
			$elem.filter('.ig_card_parameta, .parameta_area').hide();
		}
		else if ( len == 1 ) {
			$elem.filter('.ig_card_frame').hide();
		}
		else {
			$elem.show();
		}
	});
},

//.. showTimeoutTimer
showTimeoutTimer: function() {
	if ( !Env.endtime ) { return; }

	$('#lordSiteArea').empty()
	.addClass('imc_countdown')
	.data({ endtime: Env.endtime, alert: 300, alertevent: 'sessionalert' })
	.append( 'タイムアウトまで <span class="imc_countdown_display" />' );
},

//.. escapeSpecialCharacters
escapeSpecialCharacters: function() {
	//特殊文字
	var SpecialCharacters = '&shy;/&zwnj;/&zwj;/&lrm;/&rlm;/&#8203;',
		sc = SpecialCharacters.split('/'),
		sclist = $('<div/>').html( SpecialCharacters ).html().split('/');

	$('A[href^="/user/"]').each( escape );
	$('A[href^="/alliance/info.php"]').each( escape );
	$('A[href^="/land.php"]').each( escape );

	function escape() {
		var $this = $(this),
			text = $this.text();

		if ( $this.has('IMG, .img_face').length > 0 ) { return; }

		for (var i = 0; i < sclist.length; i++) {
			text = text.replace( sclist[i], sc[i], 'g' );
		}

		if ( text == '' ) { text = '(未設定)'; }

		$this.text( text );
	}
},

//.. createPulldownMenu
createPulldownMenu: function() {
	//内政用メニュー
	var data = MetaStorage('FACILITY').data,
		base_href = {},
		menu = [];

	//基本href
	$('#sideboxBottom DIV.basename LI A').each(function() {
		var $this = $(this),
			base = $this.text(),
			href = $this.attr('href');

		base_href[base] = href.replace(/page=.*$/, 'page=');
	});

	for ( var baseid in data ) {
		var facility_list = data[ baseid ],
			name = Util.getVillageById( baseid ).name,
			href = base_href[ name ] || '';

		for ( var key in facility_list ) {
			var facility = facility_list[ key ],
				new_href = '/facility/facility.php?x=' + facility.x + '&y=' + facility.y;

			if ( href != '' ) {
				new_href = href + encodeURIComponent( new_href );
			}

			key = key + ' LV.' + facility.lv;

			menu.push({ title: name + ' [' + key + ']', action: new_href });
		}
	}
	createMenu($('#gnavi .gMenu01'), menu);

	//部隊用メニュー
	createMenu($('#gnavi .gMenu02'), [
		{ title: '簡易兵士編成', action: '/facility/set_unit_list.php?show_num=100' },
		{ title: '待機兵士一覧', action: '/facility/unit_list.php' },
		{ title: '全部隊状況', action: '/facility/unit_status.php?dmo=all' },
		{ title: '敵襲状況', action: '/facility/unit_status.php?dmo=enemy' },
		{ title: '友軍状況', action: '/facility/unit_status.php?dmo=help' },
		{ title: 'デッキ１', action: '/card/deck.php?ano=0' },
		{ title: 'デッキ２', action: '/card/deck.php?ano=1' },
		{ title: 'デッキ３', action: '/card/deck.php?ano=2' },
		{ title: 'デッキ４', action: '/card/deck.php?ano=3' },
		{ title: 'デッキ５', action: '/card/deck.php?ano=4' }
	]);

	//合戦用メニュー
	createMenu($('#gnavi .gMenu05'), [
		{ title: '全国地図', action: '/country/all.php' },
		{ title: '合戦状況', action: '/war/war_situation.php' },
		{ title: '合戦格付表', action: '/war/war_ranking.php' },
		{ title: '敵襲状況', action: '/war/fight_history.php' },
		{ title: '合戦報告書', action: '/war/list.php' },
		( Env.war == 2 ) ? { title: '所属軍チャット', action: '/alliance/chat_view_army.php?pager_select=100' } : {},
		( Env.war == 2 ) ? { title: '所属国チャット', action: '/alliance/chat_view_war.php?pager_select=100' } : {}
	]);

	//同盟用メニュー
	createMenu($('#gnavi .gMenu07'), [
		{ title: '同盟チャット', action: '/alliance/chat_view.php?pager_select=100' },
		{ title: '同盟掲示板', action: '/bbs/topic_view.php' },
		( Env.chapter >= 4 ) ? { title: '同盟金山', action: '/alliance/alliance_gold_mine.php' } : {},
		{ title: '同盟情報', action: $('#gnavi .gnavi07 > A').attr('href') },
		{ title: '同盟貢物', action: '/alliance/level.php' },
		{ title: '同盟管理', action: '/alliance/manage.php' },
		{ title: '同盟募集', action: '/alliance/invite.php' }
	]);

	//格付用メニュー
	createMenu($('#gnavi .gMenu08'), [
		{ title: '国別格付', action: '/user/ranking.php?m=' },
		{ title: '全体格付', action: '/user/ranking.php?m=&c=0' },
		{ title: '天下勢力', action: '/country/country_ranking.php' },
		( Env.season >= 2 ) ? { title: '歴史書', action: '/user/history_list.php' } : {}
	]);

	//クエスト用メニュー（その他用）
	createMenu($('#gnavi .gMenu06'), [
		{ title: 'プレゼントボックス', action: '/user/present.php' },
		{ title: '戦国くじ', action: '/senkuji/senkuji.php' },
		{ title: 'スペシャル戦国くじ', action: '/senkuji/senkuji.php?ex=1' },
		{ title: '戦国くじ履歴', action: '/senkuji/senkuji_history.php' },
		{ title: 'カード一括破棄', action: function() { Page.form( '/card/deck_card_delete.php', { show_num: 100 } ); } },
		{ title: 'カードアルバム', action: '/card/card_album.php' },
		{ title: '取引', action: '/card/trade.php?t=name&k=&s=no&o=a' },
		{ title: '出品', action: '/card/trade_card.php' },
		{ title: '出品中', action: '/card/exhibit_list.php' },
		{ title: '入札中', action: '/card/bid_list.php' },
		{ title: 'ランクアップ', action: function() { Page.form( '/union/levelup.php', { union_type: 4 } ); } },
		{ title: 'スキル強化', action: function() { Page.form( '/union/levelup.php', { union_type: 1 } ); } },
		{ title: 'スキル追加', action: function() { Page.form( '/union/levelup.php', { union_type: 2 } ); } },
		{ title: 'スキル削除', action: function() { Page.form( '/union/remove.php', { union_type: 3 } ); } },
		{ title: '合成履歴', action: '/union/union_history.php' }
	]);

	function createMenu( target, menu ) {
		var submenu = $('<div class="imc_pulldown" />');

		target.find('UL').remove();

		$.each( menu, function() {
			if ( !( 'title' in this ) ) { return; }

			var $a = $('<a class="imc_pulldown_item" />').text( this.title );

			if ( typeof( this.action ) == 'function' ) {
				$a.attr( 'href', 'javascript:void(0);').click( this.action );
			}
			else {
				$a.attr( 'href', this.action )
			}

			submenu.append( $a );
		});

		if ( submenu.children().length == 0 ) { return; }

		target
		.append( submenu )
		.hover(
			function() { submenu.show(); },
			function() { submenu.hide(); }
		);
	}
},

//.. main
main: function() {}

});

//. Page.noaction.prototype
$.extend( Page.noaction.prototype, {

//.. execute
execute: function() {}

});

//■■■■■■■■■■■■■■■■■■■

//■ /world/select_world
Page.registerAction( 'world', 'select_world', {

//. main
main: function() {
	$('A[href^="/world/"]').click( this.serverSelected );
},

serverSelected: function() {
	var $this = $(this),
		world = ( $this.attr('href').match(/wd=(.\d{3})/) || [,''] )[1],
		season = ( $this.find('IMG:last').attr('src').match(/flag_.(\d{2})/) || [,''] )[1],
		chapter = ( $this.children('DIV').attr('class').match(/(?:main|sub)server_.(\d)/) || [,''] )[1],
		time = Util.getLocalTime();

	if ( world ) {
		document.cookie = world + '_st=' + time + '; domain=.sengokuixa.jp; path=/;';
		document.cookie = world + '_s=' + season + '; domain=.sengokuixa.jp; path=/;';
		document.cookie = world + '_c=' + chapter + '; domain=.sengokuixa.jp; path=/;';
	}
}

});

//■ /user/
Page.registerAction( 'user', {

//. style
style: '' +
'.imc_link { padding-left: 5px; font-size: 12px; font-weight: normal }' +
'',

//. main
main: function() {
	this.layouter();
	this.baseMap();
},

//. layouter
layouter: function() {
	var $tr = $('TABLE.profile').find('TR'),
		$a, text, html, href;

	//城主名
	$a = $tr.eq( 0 ).find('A');
	text = encodeURIComponent( $a.text() );

	href = '/war/list.php?m=&s=1&name=lord&word=' + text + '&coord=map&x=&y=';
	html = '<a class="imc_link" href="' + href + '">[合戦報告書]</a>';

	href = '/user/ranking.php?m=total&find_rank=&find_name=' + text + '&c=0';
	html += '<a class="imc_link" href="' + href + '">[格付]</a>';

	href = '/user/ranking.php?m=attack_score&find_rank=&find_name=' + text + '&c=0';
	html += '<a class="imc_link" href="' + href + '">[一戦撃破・防衛]</a>';

	$a.parent().after( html );

	//同盟名
	$a = $tr.eq( 1 ).find('A');
	text = encodeURIComponent( $a.text() );

	href = '/war/list.php?m=&s=1&name=alliance&word=' + text + '&coord=map&x=&y=';
	$a.after( '<a class="imc_link" href="' + href + '">[合戦報告書]</a>' );

	if ( location.search != '' ) {
		$tr = $('.common_table1').eq( 0 ).find('TR');

		$tr.eq( 0 ).append('<th><button id="imi_checkfall">陥落チェック</button></th>');
		$tr.slice( 1 ).append('<td />');

		$('#imi_checkfall').click( this.checkFall );
	}
},

//. baseMap
baseMap: function() {
	var name = $('DIV.family_name > P.name').text(),
		country = $.inArray( name, Data.countries ),
		list, $map;

	if ( country == -1 ) { return; }

	list = this.userBaseList();
	$map = CounteryMap.create( country );
	CounteryMap.showBasePoint( 'user', list );

	$map.css({ margin: '0px auto 10px auto' })
	.prependTo('DIV.common_box3bottom:eq(1)');

	$('.common_table1').eq( 0 ).find('TR').slice( 1 )
	.hover(
		function() {
			var { x, y } = $(this).data();

			CounteryMap.showPointer( x, y );
			Util.enter.call( this );
		},
		function() {
			CounteryMap.showPointer();
			Util.leave.call( this );
		}
	)
	.contextMenu(function() {
		var { type, name, x, y, c } = $(this).data(),
			user = $('.profile TD > .para strong').text().trim(),
			coord = x + ',' + y,
			menu = {};

		menu[ name ] = $.contextMenu.title;

		if ( MetaStorage( 'COORD.' + c ).get( coord ) ) {
			menu['座標削除'] = function() { Map.coordUnregister( x, y, c ); }
		}
		else {
			menu['座標登録'] = function() { Map.coordRegister( x, y, c, { user: user, castle: name, type: type } ); }
		}

		return menu;
	});

},

//. userBaseList
userBaseList: function() {
	var list = [],
		regex = /x=(-?\d+)&y=(-?\d+)&c=(\d+)/,
		colors = { '本領': '#f80', '所領': '#0f0', '出城': '#f0f', '陣': '#0ff', '領地': '#ff0', '開拓地': '#9a0' };

	$('TABLE.common_table1 TR.fs14').each(function() {
		var $this = $(this),
			type = $this.find('TD:eq(0)').text(),
			name = $this.find('A:eq(0)').text(),
			$a = $this.find('A:eq(1)'),
			newhref = $a.attr('href').replace('land.php', 'map.php'),
			mappoint = newhref.match( regex ),
			x = mappoint[ 1 ].toInt(),
			y = mappoint[ 2 ].toInt();
			c = mappoint[ 3 ].toInt();

		$this.data({ type: type, name: name, x: x, y: y, c: c });
		//マップで表示するように変更
		$a.attr( 'href', newhref );

		if ( colors[ type ] ) {
			list.push({ x: x, y: y, color: colors[ type ] });
		}
	});

	//本領が所領より後に描画されるように
	list.push( list.shift() );

	return list;
},

//. checkFall
checkFall: function() {
	var $tr = $('.common_table1').eq( 0 ).find('TR').slice( 1 );

	$(this).attr('disabled', true);

	$tr.each(function() {
		var $this = $(this),
			map = $this.find('A').eq( 1 ).attr('href'),
			land = map.replace('map', 'land');

		$.get( map )
		.pipe(function( html ) {
			var $html = $( html ),
				idx = $html.find('#mapOverlayMap > AREA[onclick*="' + land + '"]').index(),
				$img = $html.find('#ig_mapsAll > IMG').not('[src$="outside.png"]').eq( idx );

			if ( $img.attr('src').indexOf('fall') != -1 ) {
				$this.find('TD').last().html('<span class="red">陥落中</span>');
			}
			else {
				$this.find('TD').last().html('-');
			}
		});
	});
}

});

//■ /user/ranking
Page.registerAction( 'user', 'ranking', {

//. style
style: '' +
'TABLE.common_table1 TH,' +
'TABLE.common_table1 TD { padding: 4px 6px; }' +
'TABLE.common_table1 TD:nth-child(1) { width: 65px; padding: 4px; }' +
''

});

//■ /user/ranking_history
Page.registerAction( 'user', 'ranking_history', {

//. style
style: Page.getAction( 'user', 'ranking', 'style' )

});

//■ /user/history_list
Page.registerAction( 'user', 'history_list', {

//. main
main: function() {
	$('.common_table1 TH').first().width( 80 );
}

});

//■ /user/present
Page.registerAction( 'user', 'present', {

//. style
style: '' +
'#ig_deckheadmenubox { top: 0px; }' +
'#ig_deckheadmenubox IMG { top: 0px !important; }' +

'BUTTON.imc_receive { position: relative; top: -25px; left: 395px; }' +

'.common_box3 LABEL { position: relative; top: -6px; font-size: 14px; padding: 2px 4px; border-radius: 3px; }' +
'.common_box3:hover LABEL { background-color: #f9dea1; }' +
'',

//. main
main: function() {
	//「すべてのプレゼントを受け取る」ボタンが有るかどうか
	if ( $('#ig_allbtn').length == 0 ) { return; }

	var $button = $('<button class="imc_receive">選択したプレゼントを受け取る</button>');
	$('.ig_decksection_top').append( $button );
	$button.click( this.receive );

	$('#ig_boxInner')
	.on('click', '.common_box3', function( event ) {
		var $a = $( event.target ).closest('A'),
			$input = $(this).find('INPUT'),
			flag;

		if ( $a.length == 1 ) { return; }

		flag = $input.attr('checked');
		$input.attr( 'checked', !flag );
	});

	this.autoPager();
	this.layouter( $('#ig_boxInner .common_box3') );
},

//. autoPager
autoPager: function() {
	var self = this;

	$.autoPager({
		next: 'UL.pager LI.last A:first',
		container: '.ig_decksection_mid',
		loaded: function( html ) {
			var $box = $(html).find('#ig_boxInner'),
				$div = $box.find('.common_box3'),
				$card = $box.children('[id^="cardWindow_"]');

			self.layouter( $div );

			$('.ig_decksection_mid').append( $div );
			$('#ig_boxInner').append( $card );
		},
		ended: function() {
			Display.info('全ページ読み込み完了');
		}
	});
},

//. layouter
layouter: function( $div ) {
	$div.each(function() {
		var $a = $(this).find('A[href^="/user/present.php"]');
		if ( $a.length == 0 ) { return; }

		var pid = $a.attr('href').match(/id=(\d+)/)[ 1 ],
			html = '';

		html += '<label style="color: black; cursor: pointer;">';
		html += '<input type="checkbox" value="' + pid + '" /> 受け取る</label>';

		$a.after( html );
	});
},

//. receive
receive: function() {
	var pid_list = [],
		result, ol;

	$('.ig_decksection_mid').find('INPUT:checked').each(function() {
		pid_list.push( $(this).val() );
	});

	if ( pid_list.length == 0 ) {
		Display.info('選択されていません。');
		return false;
	}

	result = confirm('選択したプレゼントを受け取りますか？');
	if ( !result ) { return false; }

	//オーバーレイ表示
	ol = Display.dialog();
	ol.message('受け取り処理開始...');

	$.Deferred().resolve()
	.pipe(function() {
		var pid = pid_list.shift();
		if ( !pid ) { return; }

		return $.get( '/user/present.php?id=' + pid )
		.pipe(function( html ) {
			var match = html.match(/alert\(["'](.+)["']\)/);
			if ( match ) {
				ol.message( match[ 1 ].replace('\n', '') );
			}
			else {
				return $.Deferred().reject();
			}

			return Util.wait( 300 );
		})
		.pipe( arguments.callee );
	})
	.done(function() {
		ol.message('受け取り処理終了').message('ページを更新します...');
	})
	.fail(function() {
		ol.message('受け取り処理失敗').message('処理を中断します。');
	})
	.always(function() {
		Page.move( '/user/present.php' );
	});

	return false;
}

});

//■ /user/present_history
Page.registerAction( 'user', 'present_history', {

//. style
style: Page.getAction( 'user', 'present', 'style' )

});

//■ /village
Page.registerAction( 'village', {

//. style
style: '' +
/* 実行中の作業 */
'#actionLog { width: 527px; padding: 33px 8px 7px 8px; }' +
'#actionLog TABLE { position: relative; z-index: 503; }' +
'#actionLog TABLE TD DIV { width: 522px; height: 68px; max-height: 68px; min-height: 68px; padding: 0px 0px 0px 5px; }' +
'#actionLog UL { width: 500px; height: 1px; }' +
'#actionLog UL LI { width: 500px; margin-bottom: 2px; }' +
'.cover_bottom { top: 96px; }' +

'#imi_icon_lv { position: absolute; top: 5px; left: 300px; }' +
'#imi_icon_lv { float: left; height: 20px; padding: 0px 12px; line-height: 20px; text-align: center; border: solid 1px #666; color: #666; background-color: #000; margin-right: 8px; cursor: pointer; }' +
'#imi_icon_lv.imc_selected { background-color: #666; border-color: #fff; color: #fff; }' +
'#imi_icon_lv:hover { background-color: #666; border-color: #fff; color: #fff; }' +
'#maps.imc_icon_disabled DIV.imc_map_icon { display: none; }' +
'',

//. main
main: function() {
	this.layouter();
	this.getBuildStatus();
	this.getFacilityList();

	if ( Env.loginProcess ) { Util.getUnitStatusCD(); }
},

//. layouter
layouter: function() {
	$('<ul />')
	.append(
		$('<li id="imi_icon_lv">施設LV表示</li>').click( this.iconLv )
	)
	.appendTo('#village');

	$('#maps').children('DIV[class^=mapicon]').addClass('imc_map_icon');

	if ( MetaStorage('SETTINGS').get('icon_lv') == 'disabled' ) {
		$('#maps').addClass('imc_icon_disabled');
	}
	else {
		$('#imi_icon_lv').addClass('imc_selected');
	}
},

//. iconLv
iconLv: function() {
	var $this = $(this).toggleClass('imc_selected');

	if ( $this.hasClass('imc_selected') ) {
		//表示
		$('#maps').removeClass('imc_icon_disabled');
		MetaStorage('SETTINGS').set('icon_lv', '');
	}
	else {
		//非表示
		$('#maps').addClass('imc_icon_disabled');
		MetaStorage('SETTINGS').set('icon_lv', 'disabled');
	}
},

//. getBuildStatus
getBuildStatus: function() {
	var storage = MetaStorage('COUNTDOWN'),
		name = $('#basepointTop .basename').text(),
		village = Util.getVillageByName( name ),
		data, list;

	data = storage.get('建設') || {};
	list = [];

	$('#actionLog UL LI:contains("建設")').each(function() {
		var $this = $(this),
			time  = $this.find('.buildTime').text(),
			clock = $this.find('.buildClock').text(),
			name  = $this.find('A:first').text().replace(/（.+）/, '');

		list.push( [ Util.getTargetDate( time, clock ), name ] );
	});

	$('#actionLog UL LI:contains("研究中")').each(function() {
		var $this = $(this),
			time  = $this.find('.buildTime').text(),
			clock = $this.find('.buildClock').text(),
			name  = $this.text().match(/(.+)を研究中/)[1];

		list.push( [ Util.getTargetDate( time, clock ), name ] );
	});

	if ( list.length == 0 ) { delete data[ village.id ] }
	else { data[ village.id ] = list; }

	storage.set( '建設', data );

	//削除中
	data = storage.get('削除') || {};
	list = data[ village.id ] || [];
	list = $.map( list, function( ary ) { return ( ary[ 1 ] == '村落' || ary[ 1 ] == '砦' ) ? [ ary ] : null; });

	$('#actionLog UL LI:contains("削除")').each(function() {
		var $this = $(this),
			time  = $this.find('.buildTime').text(),
			clock = $this.find('.buildClock').text(),
			name  = $this.find('A:first').text().replace(/（.+）/, '');

		list.push( [ Util.getTargetDate( time, clock ), name ] );
	});

	if ( list.length == 0 ) { delete data[ village.id ] }
	else { data[ village.id ] = list; }

	storage.set( '削除', data );
},

//. getFacilityList
getFacilityList: function() {
	var storage = MetaStorage('FACILITY'),
		basename = $('#basepointTop .basename').text(),
		village = Util.getVillageByName( basename ),
		data, list = {};

	$('#mapOverlayMap')
	.find('AREA[alt^="市"]').each( addList ).end()
	.find('AREA[alt^="足軽兵舎"]').each( addList ).end()
	.find('AREA[alt^="弓兵舎"]').each( addList ).end()
	.find('AREA[alt^="厩舎"]').each( addList ).end()
	.find('AREA[alt^="兵器鍛冶"]').each( addList ).end();

	storage.begin();
	data = storage.data;
	data[ village.id ] = list;

	//表示拠点選択にある拠点だけで登録
	var baselist = BaseList.home(),
		newdata = {};

	$.each( baselist, function() {
		if ( data[ this.id ] != undefined ) {
			newdata[ this.id ] = data[ this.id ];
		}
	});

	storage.data = newdata;
	storage.commit();

	function addList() {
		var $this = $(this),
			alt = $this.attr('alt'),
			href = $this.attr('href'),
			array;

		array = alt.match(/(.+) LV.(\d+)/);
		if ( !array ) { return; }

		var [ alt, name, lv ] = array;

		array = href.match(/x=(\d+)&y=(\d+)/);
		var [ href, x, y ] = array;

		list[ name ] = { x: x.toInt(), y: y.toInt(), lv: lv.toInt() };
	}
}

});

//■ /land
Page.registerAction( 'land', {

//. main
main: function() {
	this.getBuildStatus();
},

//. getBuildStatus
getBuildStatus: function() {
	var storage = MetaStorage('COUNTDOWN'),
		name = $('.ig_mappanel_maindataarea H3').text().trim(),
		village = Util.getVillageByName( name ),
		data, list;

	//本領・所領の場合は処理しない
	if ( village.type == '本領' || village.type == '所領' ) { return; }

	data = storage.get('建設') || {};
	list = [];

	$('#actionLog UL LI:contains("建設")').each(function() {
		var $this = $(this),
			time  = $this.find('.buildTime').text(),
			clock = $this.find('.buildClock').text(),
			name  = $this.text();

		if ( name.indexOf('出城') != -1 ) { name = '出城'; }
		else if ( name.indexOf('陣') != -1 ) { name = '陣'; }
		else if ( name.indexOf('砦') != -1 ) { name = '砦'; }
		else if ( name.indexOf('村落') != -1 ) { name = '村落'; }
		else { name = '？'; }

		list.push( [ Util.getTargetDate( time, clock ), name ] );
	});

	data[ village.id ] = list;
	storage.set( '建設', data );

	//破棄
	data = storage.get('削除') || {};
	list = [];

	$('#actionLog UL LI:contains("破棄")').each(function() {
		var $this = $(this),
			time  = $this.find('.buildTime').text(),
			clock = $this.find('.buildClock').text(),
			name  = '陣';//$this.find('A:first').text();

		list.push( [ Util.getTargetDate( time, clock ), name ] );
	});

	if ( list.length == 0 ) { delete data[ village.id ] }
	else { data[ village.id ] = list; }

	storage.set( '削除', data );
}

});

//■ /facility/castle
Page.registerAction( 'facility', 'castle', {

//. main
main: function() {
	var name = $('DIV.ig_tilesection_detailarea > H3:eq(0) > A').text(),
		village = Util.getVillageCurrent(),
		data = MetaStorage('COUNTDOWN').get('削除') || {},
		text, list;

	list = data[ village.id ] || [];
	list = $.map( list, function( ary ) { return ( ary[ 1 ] == '村落' || ary[ 1 ] == '砦' ) ? null : [ ary ]; });

	text = $('.ig_tilesection_btnarea_left:contains("削除中")').text();
	text = ( text.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/) || [] )[ 0 ];
	if ( text ) {
		list.push([ text.getTime(), name ]);
	}

	if ( list.length == 0 ) { delete data[ village.id ] }
	else { data[ village.id ] = list; }

	MetaStorage('COUNTDOWN').set( '削除', data );
}

});

//■ /facility/facility
Page.registerAction( 'facility', 'facility', {

//. style
style: '' +
'INPUT { ime-mode: disabled; }' +

/* 兵舎用 */
'TABLE.paneltable { margin-bottom: 10px; }' +
'TABLE.imc_training { width: 100%; margin-top: 5px; }' +
'TABLE.imc_training TH IMG { margin: 0px; }' +
'TABLE.imc_training TD { min-width: 80px; padding: 0px; }' +
'.ig_tilesection_innerborder { padding-bottom: 0px; margin-bottom: 0px; }' +
'.ig_tilesection_innermid2 { width: 700px; }' +
'.ig_tilesection_iconarea { height: 100px; margin-bottom: 5px; }' +
'.ig_tilesection_iconarea IMG { margin: 0px; }' +
'.ig_tilesection_btnarea_left { margin-top: 5px; }' +
'.imc_training_button { float: right; width: 50px; height: 14px; font-size: 14px; text-align: center; padding: 3px 8px; border: solid 1px #543; border-radius: 3px; cursor: pointer; user-select: none; }' +
'.imc_training_button:hover { color: #fff; background-color: #543; }' +
'.imc_training_button:after { content: "閉じる"; }' +
'.imc_training_button.is_close:after { content: "開く"; }' +
'TR.imc_facility TD { text-align: center; }' +
'TR.imc_facility TD ~ TD { border-left: solid 1px #fff; }' +
'BUTTON { position: relative; top: 1px; }' +
/* 学舎用 */
'TR.im_dou TD { padding: 0px; }' +
'TR.im_dou TD .money_b { padding: 5px 5px 4px 24px; margin: 0px 5px; background-position: 0px 0px; }' +
'.ig_tilesection_btnarea { margin-top: 5px; }' +
'.ig_tilesection_btnarea2 { margin-top: 5px; }' +
'',

//. main
main: function() {
	var name = $('DIV.ig_tilesection_detailarea > H3:eq(0) > A').text();

	switch ( name ) {
	case '厩舎': case '足軽兵舎': case '弓兵舎': case '兵器鍛冶':
		this.training( name ); break;
	case '市':
		this.dealings(); break;
	case '学舎':
		this.research(); break;
	}
},

//. training
training: function( name ) {
	var self = this,
		storage = MetaStorage('SETTINGS'),
		facility = MetaStorage('FACILITY'),
		baselist = BaseList.home(),
		facilitylist = [];

	//訓練できるかチェック
	if ( $('.ig_tilesection_mid').length == 1 ) { return; }

	$.each( baselist, function() {
		var data = facility.get( this.id );

		if ( !data ) { return; }

		if ( data[ name ] && data[ name ].lv > 0 ) {
			facilitylist.push( $.extend( { name: this.name, id: this.id }, data[ name ] ) );
		}
	});

	$(document).data( 'facilitylist', facilitylist );

	//訓練中の兵士情報取得
	var list = {};
	$('TABLE.paneltable_red').each(function() {
		var $this = $(this),
			key = $this.find('TR:eq(0) TD').text(),
			$tr;

		if ( !list[ key ] ) {
			list[ key ] = $('<table class="paneltable_red table_tile imc_training" />');
		}

		$tr = $('<tr/>'),
		$tr.append( $this.find('TR').slice( 1, 4 ).children().removeAttr('width') );

		list[ key ].append( $tr );
	});

	//残った訓練中の兵士情報表示欄を削除
	$('P:contains("現在、訓練中の兵士です。")').prev().nextUntil('.ig_paneloutbtn').remove();
	//施設情報を下へ移動
	$('#ig_tileheadmenu').nextUntil('P:contains("訓練できる兵種")').insertBefore('.ig_paneloutbtn');
	//説明部分削除
	$('#ig_tileheadmenu + .ig_top_alartbox').remove();

	//兵種表示を逆に
	var $div = $('.ig_tilesection_mid').eq( 0 ),
		$innertop = $div.children('DIV:nth-child(3n+1)'),
		$innermid = $div.children('DIV:nth-child(3n+2)'),
		$innerbottom = $div.children('DIV:nth-child(3n)');

	$innertop.each(function( idx ) {
		$div.prepend( $innerbottom.eq( idx ) );
		$div.prepend( $innermid.eq( idx ) );
		$div.prepend( $innertop.eq( idx ) );
	});

	$('.ig_tilesection_mid').eq( 0 ).prepend('<div class="ig_solder_commentarea" />');

	//訓練数の表示、表示幅微調整
	$innermid.each(function() {
		var $this = $(this),
			name  = $this.find('H3 B').text().slice(1, -1),
			key   = '訓練_' + name,
			close = storage.get( key ),
			$close, html, text;

		//兵種の説明
		$this.find('.ig_tile_explain').hide();

		//現在の兵士数表示位置変更
		text = $this.find('DIV.ig_tilesection_iconarea > P').remove().text() || '';
		text = ( text.match(/(\d+)/) || [,0] )[1];
		$this.find('H3').append('<span style="margin: 0px 15px;">待機数 ： ' + text + '</span>');

		//訓練中の兵士表示
		if ( list[ name ] ) { $this.append( list[ name ] ); }

		$close = $('<span class="imc_training_button"></span>');
		$close.click(function() {
			var $this = $(this),
				$container = $this.closest('.ig_tilesection_innerborder');

			if ( $this.hasClass('is_open') ) {
				$this.removeClass('is_open').addClass('is_close');
				$container.find('.ig_tilesection_iconarea').hide();
				$container.find('.ig_tilesection_detailarea TABLE').hide();
				storage.set( key, true );
			}
			else {
				$this.addClass('is_open').removeClass('is_close');
				$container.find('.ig_tilesection_iconarea').show();
				$container.find('.ig_tilesection_detailarea TABLE').show();
				storage.remove( key );
			}
		});

		$this.find('H3').append( $close );

		if ( close ) {
			$close.addClass('is_close');
			$this.find('.ig_tilesection_iconarea').hide();
			$this.find('.ig_tilesection_detailarea TABLE').hide();
		}
		else {
			$close.addClass('is_open');
		}
	});

	this.trainingPulldown( $innermid );

	$('INPUT:submit').click(function() {
		var $select = $(this).parent().find('SELECT'),
			unit_value = $select.val();

		storage.set('unit_value', unit_value);
	});

	$('BUTTON').click(function() {
		var $select = $(this).parent().find('SELECT'),
			unit_value = $select.first().val(),
			create_count = $select.last().val(),
			facility = $select.data('facility'),
			current = Util.getVillageCurrent(),
			ol;

		if ( !confirm('訓練を開始してよろしいですか？') ) { return false; }

		ol = Display.dialog();
		ol.message('訓練登録処理開始...');

		storage.set('unit_value', unit_value);
		self.trainingExecute( facility, create_count, current, ol );

		return false;
	});
},

//. trainingPulldown
trainingPulldown: function( $div ) {
	var self = this,
		unit_value = MetaStorage('SETTINGS').get('unit_value') || 100,
		pool = Util.getPoolSoldiers(),
		freecapa = pool.capacity - pool.soldier;

	$('.ig_solder_commentarea').text( pool.soldier + ' / ' + pool.capacity );

	$div.each(function() {
		var $this = $(this),
			$table = $this.find('TABLE').eq( 1 ),
			name = $this.find('H3 B').text().slice(1, -1),
			data = Soldier.getByName( name ),
			maxsol = Number.MAX_VALUE, val = 0, step = 100, options = [],
			$tr, $select, materials, resource;

		//各拠点の施設表示
		$tr = $table.find('TR.noborder');
		$tr.removeClass('noborder');
		$tr.find('TH').first().remove();
		$tr.find('TD').first().remove();
		$tr.find('TD').attr('colspan', 3);

		//資源不足等で訓練できない場合はプルダウン化処理をしない
		var $input = $this.find('INPUT[type="text"]');
		if ( $input.length == 0 ) { return; }

		html = '（分割回数：<select id="create_count_' + data.type + '">' +
			'<option value="1">1回</option>' +
			'<option value="2">2回</option>' +
			'<option value="3">3回</option>' +
			'<option value="4">4回</option>' +
			'<option value="5">5回</option>' +
			'<option value="6">6回</option>' +
			'<option value="7">7回</option>' +
			'<option value="8">8回</option>' +
			'<option value="9">9回</option>' +
			'<option value="10">10回</option>' +
		'</select>' +
		'　<button>複数拠点で訓練する</button>）';

		$tr.find('FORM').append( html );
		$table
		.append('<tr><th>拠点</th><th width="70">LV</th>' +
			'<th width="120"><img alt="訓練する人数" src="' + Env.externalFilePath + '/img/tile/icon_training_num.png"></th>' +
			'<th width="120"><img alt="訓練にかかる時間" src="' + Env.externalFilePath + '/img/tile/icon_training_time.png"></th>' +
			'</tr>'
		)
		.append('<tbody id="imi_training_' + data.type + '"></tbody>');

		//必要資源取得（金山効果は込）
		$tr = $table.find('TR').eq( 0 );
		materials = [
			$tr.find('.icon_wood').text().match(/(\d+)/)[ 1 ].toInt(),
			$tr.find('.icon_cotton').text().match(/(\d+)/)[ 1 ].toInt(),
			$tr.find('.icon_iron').text().match(/(\d+)/)[ 1 ].toInt(),
			$tr.find('.icon_food').text().match(/(\d+)/)[ 1 ].toInt()
		];

		resource = [
			$('#wood').text().toInt(),
			$('#stone').text().toInt(),
			$('#iron').text().toInt(),
			$('#rice').text().toInt()
		];

		//最大訓練数を算出する、ただし陣屋は考慮されない
		Util.getConsumption( materials, 100 ).forEach(function( value, idx ) {
			var sol = Math.floor( resource[ idx ] / ( value  / 100 ) );
			if ( sol < maxsol ) { maxsol = sol; }
		});

		if ( maxsol < 100 ) {
			//最適資源値で訓練できない場合、初期最大値の値を使用
			maxsol = ( $input.parent().next().text().match(/(\d+)/) || [,0] )[ 1 ];
			maxsol = maxsol.toInt();
		}

		if ( freecapa < maxsol ) { maxsol = freecapa; }

		options.push('<option value="10">10</option>');
		while ( val < maxsol ) {
			val += step;
			if ( val >= maxsol ) { val = maxsol; }
			if ( val >= 1000 ) { step = 500; }

			options.push('<option value="' + val + '">' + val + '</option>');
		}

		$select = $('<select/>');
		$select.append( options.join('') );
		$select.attr({ name: $input.attr('name'), value: unit_value });

		//テキストボックスをプルダウンに置き換え
		$input.parent().next().remove();
		$input.replaceWith( $select );

		$select.data({ type: data.type, training: data.training, materials: materials })
		.change( self.trainingDivide ).trigger('change');
	});
},

//. trainingDivide
trainingDivide: function( e, list ) {
	var $this = $(this),
		{ type, training, materials } = $this.data(),
		unit_value = $this.val(),
		facility = [], rate = [],
		total1 = 0, total2 = 0, total3 = 0,
		len = 0, lv_max = 0, lv_max_idx = -1;

	list = list || $(document).data('facilitylist');
	len = list.length;

	for ( var i = 0; i < len; i++ ) {
		facility.push( $.extend( { type: type }, list[ i ] ) );
	}

	if ( len == 1 ) {
		//施設が１つの場合、分配しない
		facility[ 0 ].unit_value = unit_value;
	}
	else {
		//トレーニング時間の補正値から訓練数の割合算出
		for ( var i = 0; i < len; i++ ) {
			var value = Math.pow( 0.8, facility[ i ].lv - 1 );
			rate.push( value );
			total1 += value;
		}
		for ( var i = 0; i < len; i++ ) {
			rate[ i ] = total1 / rate[ i ];
			total2 += rate[ i ];
		}
		for ( var i = 0; i < len; i++ ) {
			rate[ i ] = rate[ i ] / total2;
		}

		//訓練数分配
		for ( var i = 0, len = facility.length; i < len; i++ ) {
			var value = Math.floor( unit_value * rate[ i ] );
			facility[ i ].unit_value = value;
			total3 += value;

			if ( facility[ i ].lv > lv_max ) {
				lv_max = facility[ i ].lv;
				lv_max_idx = i;
			}
		}

		if ( unit_value != total3 ) {
			//小数点以下を切り捨てているので、不足分はLVが一番高い施設で調整
			facility[ lv_max_idx ].unit_value += ( unit_value - total3 );
		}
	}

	//表示
	var html = '',
		total_wood = total_stone = total_iron = total_rice = 0;

	$.each( facility, function() {
		var [ wood, stone, iron, rice ] = Util.getConsumption( materials, this.unit_value ),
			time;

		total_wood  += wood;
		total_stone += stone;
		total_iron  += iron;
		total_rice  += rice;

		time = this.unit_value * training;
		time = Math.ceil( time * Math.pow( 0.8, this.lv - 1 ) );

		html += '<tr class="imc_facility">';
		html += '<th>' + this.name + '</th>';
		html += '<td>' + this.lv + '</td>';
		html += '<td>' + this.unit_value + '</td>';
		html += '<td>' + time.toFormatTime(); + '</td>';
		html += '</tr>';
	});

	//消費資源表示
	var $tr = $this.closest('TBODY').find('TR').eq( 0 ).clone();
	$tr.find('.icon_wood').text( '木 ' + total_wood.toFormatNumber() );
	$tr.find('.icon_cotton').text( '綿 ' + total_stone.toFormatNumber() );
	$tr.find('.icon_iron').text( '鉄 ' + total_iron.toFormatNumber() );
	$tr.find('.icon_food').text( '糧 ' + total_rice.toFormatNumber() );

	$('#imi_training_' + type).html( html ).append( $tr );

	$this.data( 'facility', facility );
},

//. trainingExecute
trainingExecute: function( facility, create_count, current, ol ) {
	var data = facility.shift(),
		self = arguments.callee;

	if ( !data ) { return; }

	$.Deferred().resolve()
	.pipe(function() {
		var href = Util.getVillageChangeUrl( data.id, '/user/' );

		return $.get( href );
	})
	.pipe(function() {
		ol.message('「' + data.name + '」にて登録中...');

		var href = '/facility/facility.php?x=' + data.x + '&y=' + data.y;

		return $.post( href, { unit_id: data.type, x: data.x, y: data.y, count: data.unit_value, create_count: create_count, btnSend: true } );
	})
	.pipe(function() {
		if ( facility.length == 0 ) {
			ol.message('訓練登録処理完了').message('ページを更新します...');

			var href = Util.getVillageChangeUrl( current.id, '/facility/unit_list.php' );

			Page.move( href );
		}
		else {
			self.call( self, facility, create_count, current, ol );
		}
	});
},

//. dealings
dealings: function() {
	//施設情報を下へ移動
	$('#ig_tileheadmenu').nextUntil('DIV:not([class])').insertBefore('.ig_paneloutbtn');
},

//. research
research: function() {
	//施設情報を下へ移動
	$('#facilityPartForm').insertBefore('.ig_paneloutbtn:last');

	//必要銅銭追加
	$('#ig_mainareabox > DIV.ig_tilesection_mid').find('DIV.ig_tilesection_innermid, DIV.ig_tilesection_innermid2')
	.each(function() {
		var $this = $(this),
			name = $this.find('H3:last').text().slice(1, -1),
			data = Soldier.getByName( name ),
			$tr, $clone;

		if ( !data ) { return; }

		$tr = $this.find('TABLE TR:first');
		$clone = $tr.clone().addClass('im_dou');

		$clone.find('TD').empty()
		.append( '<span class="money_b">' + data.dou + '</span>' );

		$tr.after( $clone );
	});
}

});

//■ /facility/select_facility
Page.registerAction( 'facility', 'select_facility', {

//.main
main: function() {
	var lv = ( $('#lordLV').text().match(/LV.(\d+)/) || [,0] )[1].toInt();

	if ( lv < 16 ) { return; }

	var $top = $('.ig_tilesection_innertop, .ig_tilesection_innertop2'),
		$mid = $('.ig_tilesection_innermid, .ig_tilesection_innermid2'),
		$bottom = $('.ig_tilesection_innerbottom, .ig_tilesection_innerbottom2');

	$mid.each(function( idx ) {
		var text = $(this).find('H3 A').text().trim();

		if ( $.inArray( text, [ '木工所', '機織り場', 'たたら場', '水田' ] ) != -1 ) {
			$top.eq( idx ).hide();
			$mid.eq( idx ).hide();
			$bottom.eq( idx ).hide();
		}
	});
}

});

//■ /facility/unit_list
Page.registerAction( 'facility', 'unit_list', {

//. main
main: function() {
	Util.getTrainingStatus( $('TABLE.table_fightlist2').slice( 1 ) );
}

});

//■ /facility/dungeon
Page.registerAction( 'facility', 'dungeon', {

//. style
style: '' +
'.table_waigintunit TH ~ TD { min-width: 110px; }' +
'',


//. main
main: function() {
	this.layouter();
	this.showSoldier();

	if ( $('.table_waigintunit').length > 0 ) {
		Util.getUnitStatusCD();
	}
},

//. layouter
layouter: function() {
	var dungeon = MetaStorage('SETTINGS').get('dungeon');

	$('.dungeon_list_header')
	.click(function() {
		var dungeon = $(this).find('INPUT:checked').val();
		MetaStorage('SETTINGS').set( 'dungeon', dungeon );
	})
	.find('INPUT[value="' + dungeon + '"]').attr('checked', true);

	//ボタンエリアを上部に複製
	$('.dungeon_list_header').after( $('.btnarea').clone() );

	//全部隊選択
	$('.table_waigintunit').find('INPUT:checkbox').attr('checked', true);

	//テーブルクリック
	$('.table_waigintunit')
	.css({ cursor: 'pointer' })
	.hover( Util.enter, Util.leave )
	.click(function() {
		var $input = $(this).find('INPUT:checkbox');
		$input.attr('checked', !$input.attr('checked'));
	});
},

//. showSoldier
showSoldier: function() {
	$('.table_waigintunit').each(function() {
		var $this = $(this),
			$tr = $this.find('TR'),
			$tr2 = $tr.eq( 2 ),
			$tr3 = $tr.eq( 3 );

		$tr2.find('TH').css({ fontSize: '14px' }).text('HP／討伐');
		$tr3.find('TH').css({ fontSize: '14px' }).text('指揮兵');

		$this.find('A.thickbox').each(function( idx ) {
			var href = $(this).attr('href') || '',
				id = ( href.match(/cardWindow_\d+/) )[ 0 ],
				$card = $( '#' + id ),
				card = new LargeCard( $card ),
				hp = $tr2.find('TD').eq( idx ).text().trim(),
				gage = $tr3.find('TD').eq( idx ).text().trim();

			$tr2.find('TD').eq( idx ).text( hp + ' / ' + gage );
			$tr3.find('TD').eq( idx ).text( card.solName + ' (' + card.solNum + ')' );
		});
	});
}

});

//■ /facility/send_troop
Page.registerAction( 'facility', 'send_troop', {

//. style
style: '' +
'#ig_deckheadmenubox { height: 50px; }' +
'.btnarea { height: auto; margin-bottom: 0px; }' +
'.ig_decksection_mid { padding-bottom: 0px; }' +
'.ig_decksection_bottom { height: 15px; }' +

/* 待機武将一覧 */
'.table_waigintunit { width: 620px; margin: 10px auto; }' +
'.table_waigintunit TH ~ TD { min-width: 110px; }' +
'.table_waigintunit TD.imc_command { width: 50px; }' +
'.imc_command_button { border: solid 1px #ccc; padding: 3px 0px; background-color: #F2F1DD; }' +
'.imc_command_button.imc_backup:hover  { background-color: #09c; color: #fff; }' +
'.imc_command_button.imc_attack:hover  { background-color: #f66; }' +
'.imc_command_button.imc_camp:hover    { background-color: #c33; color: #fff; }' +
'.imc_command_button.imc_develop:hover { background-color: #390; color: #fff; }' +
'.imc_command_button.imc_meeting:hover { background-color: #6cf; }' +

/* 出陣確認画面 */
'TH.imc_speed { font-size: 12px; }' +
'.imc_skill_header { font-weight: bold; text-shadow: 1px 0px 3px #333, -1px 0px 3px #333, 0px 1px 3px #333, 0px -1px 3px #333; }' +
'.imc_button { position: relative; top: -15px; display: inline-block; margin-left: 10px; width: 100px; height: 34px; line-height: 34px; color: #333; font-size: 14px; font-weight: bold; text-align: center; text-shadow: 0px 1px 0px #fff; background: -moz-linear-gradient(top, #eee, #aaa); border: solid 1px #666; border-radius: 3px; box-shadow: inset 0px 0px 1px 1px #fff; cursor: pointer; }' +
'.imc_button.imc_camp { color: #f33; text-shadow: 1px 1px 0px #600; }' +

/* 部隊スキル */
'#imi_speed { margin: 0px; }' +
'.imc_unit_skill { background-color: #ddd; border-bottom: medium none; text-align: center; margin-top: 10px; }' +
'#imi_unit_skill { width: 40px; text-align: right; ime-mode: disabled; }' +
'.imc_unit_skill BUTTON { margin-left: 5px; }' +
'',

//. main
main: function() {
	var title = $('.ig_decksection_top').text();

	$('#ig_deckmenu').remove();

	switch ( title ) {
		case '待機部隊一覧':
			this.layouter();
			this.showSpeed();
			this.commandButton();
			break;
		case '出陣確認':
			this.layouter2();
			this.unitSpeed();
			this.arrivalCopy();
			if ( Env.war > 0 ) { this.confluence(); }
			break;
	}
},

//. layouter
layouter: function() {
	//部隊がない場合、全出陣は表示しない
	if ( $('#input_troop :radio[name="unit_select"]').length == 0 ) { return; }

	$('#ig_gofightboxtitle P.mb10').addClass('imc_move_type');

	//ボタンエリアを上部に複製、非表示項目は削除する
	$('.btnarea').clone().prependTo('#input_troop').find('INPUT:hidden, SPAN, BR').remove();

	//全出陣ボタン
	$('<img title="全出陣" style="cursor: pointer;" />')
	.attr( 'src', Data.images.all_attack )
	.appendTo('.btnarea')
	.click( this.sendAll );

	//テーブルクリック
	$('.table_waigintunit')
	.css({ cursor: 'pointer' })
	.hover( Util.enter, Util.leave )
	.click(function() {
		$(this).find('INPUT:radio').attr('checked', true);
	})
	.eq( 0 ).trigger('click');
},

//. showSpeed
showSpeed: function() {
	var village = Util.getVillageCurrent(),
		x = $('INPUT[name="village_x_value"]').val(),
		y = $('INPUT[name="village_y_value"]').val(),
		dist = Util.getDistance( village, { x: x, y: y } );

	$('.table_waigintunit').each(function() {
		var $this = $(this),
			cards = [], speed, time, html;

		$this.find('A.thickbox').each(function() {
			var href = $(this).attr('href') || '',
				id = ( href.match(/cardWindow_\d+/) )[ 0 ],
				$card = $( '#' + id );

			cards.push( new LargeCard( $card ) );
		});

		speed = Util.getSpeed( cards );
		time = Math.floor( 3600 * dist / speed );

		if ( x == '' || y == '' ) {
			html = '<th colspan="2" class="imc_speed">目的地不明</th>';
		}
		else {
			html = '<th colspan="2" class="imc_speed">速度：' + speed.toRound( 1 ) + '　時間：' + time.toFormatTime() + '</th>';
		}

		$this.find('TH').first().attr('colspan', 4).after( html );
	});
},

//. commandButton
commandButton: function() {
	//行動タイプ
	var commands = $('.imc_move_type INPUT').map(function() {
		var type = $(this).val();

		switch ( type ) {
			case '301':
				return '<div class="imc_command_button imc_backup" data-type="301">加勢</div>';
			case '302':
				return '<div class="imc_command_button imc_attack" data-type="302">攻撃</div>';
			case '307':
				return '<div class="imc_command_button imc_camp" data-type="307">陣張</div>';
			case '308':
				return '<div class="imc_command_button imc_develop" data-type="308">開拓</div>';
			case '320':
				return '<div class="imc_command_button imc_meeting" data-type="320">合流</div>';
		}

		return '';
	}).get();

	while ( commands.length < 4 ) {
		commands.push('<div class="imc_command_button imc_none">-</div>');
	}
	commands = commands.join('');

	$('.table_waigintunit').each(function() {
		var $this = $(this),
			$tr = $this.find('TR:first');

		if ( $this.find('INPUT:radio').length == 0 ) {
			$tr.prepend('<td rowspan="3" style="width: 50px;">行<br/>動<br/>中</td>')
		}
		else {
			$tr.prepend('<td rowspan="3" class="imc_command">' + commands + '</td>');
		}
	});

	$('.imc_command_button').not('.imc_none').click(function() {
		var $this = $(this);
			$table = $this.closest('TABLE'),
			type = $this.data('type');

		$table.find('INPUt:radio').attr('checked', true);
		$('.imc_move_type').find('INPUT[value=' + type + ']').attr('checked', 'true');
		$('.btnarea A:first').click();
	});
},

//. layouter2
layouter2: function() {
	//ボタンエリアを上部に複製、非表示項目は削除する
	$('.btnarea').clone().prependTo('#input_troop').find('INPUT:hidden').remove();

	//スキル表示変更
	$('#btn_gofight_skill_navi').remove();
	$('#data_gofight_skill_deck').removeAttr('id')
	.find('TABLE').prepend('<tr><th colspan="4" class="imc_skill_header" style="color: #cff;">部隊スキル</th></tr>');
	$('#data_gofight_skill_unit').removeAttr('id').css({ marginTop: '10px' })
	.find('TABLE').prepend('<tr><th colspan="4" class="imc_skill_header">武将スキル</th></tr>');
},


//. sendAll
sendAll: function() {
	var $list  = $('#input_troop :radio[name="unit_select"]'),
		ol, tasks;

	if ( $list.length == 0 ) { return; }
	if ( !confirm('部隊を全て出陣させます。\nよろしいですか？') ) { return; }

	//オーバーレイ表示
	ol = Display.dialog();
	ol.message('全出陣処理開始...');

	tasks  = [];
	$list.each(function() {
		tasks.push( sendData.call( this ) );
	});

	$.when.apply( $, tasks )
	.done(function() {
		ol.message('全出陣処理終了').message('ページを更新します...');
	})
	.fail(function() {
		ol.message('全出陣処理失敗').message('処理を中断します。');
	})
	.always(function() {
		Page.move( '/facility/unit_status.php?dmo=all' );
	});

	function sendData() {
		var $this = $(this).attr('checked', true),
			post_data = $('#input_troop').serialize() + '&btn_preview=true',
			unit_name = $this.closest('TBODY').find('.waitingunittitle').text().replace(/（部隊スキルあり）/, ''),
			id = $this.val();

		ol.message( unit_name + '出陣中...' );

		return $.post( '/facility/send_troop.php#ptop', post_data )
		.pipe(function( html ) {
			var $html = $(html),
				title = $(html).find('.ig_decksection_top').text(),
				post_data;

			if ( title != '出陣確認' ) { return $.Deferred().reject(); }

			post_data = $html.find('#input_troop').serialize() + '&btn_send=true';

			return $.post( '/facility/send_troop.php#ptop', post_data );
		});
	};
},

//. unitSpeed
unitSpeed: function() {
	var village = Util.getVillageCurrent(),
		x = $('INPUT[name="village_x_value"]').val(),
		y = $('INPUT[name="village_y_value"]').val(),
		cards = [], dist, html;

	//距離取得
	dist = Util.getDistance( village, { x: x, y: y } );

	//カード情報取得
	$('.ig_gofightconfirm_data').find('A.thickbox').each(function() {
		var href = $(this).attr('href') || '',
			id = ( href.match(/cardWindow_\d+/) )[ 0 ],
			$card = $( '#' + id );

		cards.push( new LargeCard( $card ) );
	});

	$('#ig_gofightconfirmboxtitle TR:last TD:first SPAN').attr('id', 'imi_arrival');
	$('.gofight_detail > DIV:last SPAN:last').contents().filter(function() { return this.nodeType == 3 && this.nodeValue.trim() != ''; }).wrap('<span id="imi_speed"/>');

	html = '' +
	'<p class="imc_unit_skill">' +
		'部隊スキル（速度）　+ <input id="imi_unit_skill" value="0" /> %　' +
		'<button id="imi_unitskill_calc">再計算</button>' +
		'<button id="imi_unitskill_clear">クリア</button>' +
	'</p>';
	$('.gofight_detail').append( html );

	$('#imi_unitskill_calc').click(function() {
		var text = $('#imi_unit_skill').val() || '0',
			match = text.match(/^\d{0,2}\.?\d{0,2}$/),
			modify, speed, time;

		if ( match ) {
			modify = match[ 0 ].toFloat();
		}
		else {
			$('#imi_unit_skill').val('0');
			modify = 0;
		}

		speed = Util.getSpeed( cards, modify );
		time = Math.floor( 3600 * dist / speed );

		$('#imi_speed').text( speed.toRound( 1 ) + '　(+' + modify + '%)' );
		$('#imi_arrival').text( '到着まで　' + time.toFormatTime() );

		unsafeWindow.time_incr[ 0 ] = time;

		return false;
	});

	$('#imi_unitskill_clear').click(function() {
		$('#imi_unit_skill').val('0');
		$('#imi_unitskill_calc').click();

		return false;
	});
},

//. arrivalCopy
arrivalCopy: function() {
	var $button = $('<button>コピー</button>');

	$('#imi_arrival').after( $button );

	$button.click(function() {
		var text = '';

		text += $('#ig_gofightconfirmboxtitle TR:first TD:first SPAN').text().replace(/\t/g, '').trim();
		text += '　';
		text += $('#imi_arrival').text();

		GM_setClipboard( text );

		return false;
	});
},

//. confluence
confluence: function() {
	if ( $('#input_troop INPUT[name="radio_move_type"]').val() != '302' ) { return; }

	$('<span class="imc_button">合流検索</span>').appendTo('.btnarea')
	.one('click', function() {
		var $form = $('#input_troop');

		$(this).attr('disabled', true);

		Page.form('/facility/confluence_list.php', {
			village_x_value: $form.find('INPUT[name="village_x_value"]').val(),
			village_y_value: $form.find('INPUT[name="village_y_value"]').val(),
			unit_select: $form.find('INPUT[name="unit_select"]').val(),
			radio_move_type: 320,
			x: '',
			y: ''
		});
	});
}

});

//■ /facility/confluence_list
Page.registerAction( 'facility', 'confluence_list', {

//. style
style: '' +
'.imc_button { position: relative; top: -15px; left: 10px; display: inline-block; width: 100px; height: 34px; line-height: 34px; color: #333; font-size: 14px; font-weight: bold; text-align: center; text-shadow: 0px 1px 0px #fff; background: -moz-linear-gradient(top, #eee, #aaa); border: solid 1px #666; border-radius: 3px; box-shadow: inset 0px 0px 1px 1px #fff; cursor: pointer; }' +
'',

//. main
main: function() {
	$('.common_table1').find('TR').slice( 1 )
	.css({ cursor: 'pointer' })
	.hover( Util.enter, Util.leave )
	.click(function() {
		$(this).find('INPUT:radio:enabled').attr('checked', true);
	});

	$('<span class="imc_button">通常攻撃</span>').appendTo('#ig_deckboxInner > .center.mb10')
	.one('click', function() {
		var $form = $('#search_form');

		Page.form('/facility/send_troop.php#ptop', {
			village_x_value: $form.find('INPUT[name="village_x_value"]').val(),
			village_y_value: $form.find('INPUT[name="village_y_value"]').val(),
			unit_select: $form.find('INPUT[name="unit_select"]').val(),
			radio_move_type: 302,
			x: '',
			y: '',
			btn_preview: 'true'
		});
	});
}

});

//■ /facility/confluence_confirm
Page.registerAction( 'facility', 'confluence_confirm', {

//. main
main: Page.getAction( 'facility', 'send_troop', 'layouter2' )

});

//■ /facility/unit_status
Page.registerAction( 'facility', 'unit_status', {

//. style
style: '' +
/* 敵襲 */
'.imc_new_enemy { border: solid 4px #f66; }' +
'',

//. main
main: function() {
	var dmo = (location.search.match(/dmo=(.+)/) || [,''])[1];

	if ( dmo == '' || dmo == 'all' ) {
		Util.getUnitStatus( $('.ig_fight_statusarea') );
		this.showModeCamp();
	}
	else if ( dmo == 'sortie' ) {
		this.showModeCamp();
	}
	else if ( dmo == 'enemy' ) {
		this.analyzeRaid();
	}

	this.layouter();
},

//. layouter
layouter: function() {
	$('TABLE.table_fightlist').each(function() {
		$(this).find('TR').eq( 2 ).find('TD').each(function() {
			var $td = $(this),
				$a = $td.find('A').detach(),
				text, href;

			if ( $a.length == 0 ) { return; }

			text = $td.find('SPAN').text().trim();
			href = $a.attr('href').replace('land', 'map');

			$td.find('SPAN').empty()
			.append( $a )
			.append( $('<A style="margin-left: 10px;" />').text( text ).attr('href', href) );
		});
	});
},

//. showModeCamp
showModeCamp: function() {
	$('TABLE.table_fightlist').each(function() {
		var $this = $(this),
			count = $this.find('TR:eq(0) TD:eq(2)').text(),
			$img = $this.find('TR:eq(1) TD:eq(1) IMG'),
			src = $img.attr('src') || '';

		//出陣中「icon_attack.png」全部隊「mode_attack.png」
		if ( src.indexOf('_attack.png') != -1 && count == '-' ) {
			$img.attr('src', Data.images.gofight_mode_camp);
		}
	});
},

//. analyzeRaid
analyzeRaid: function() {
	var storage = MetaStorage('UNIT_STATUS'),
		list = storage.get('敵襲') || [],
		keylist = {},
		newlist = [], baselist = {}, alermFlg = false;

	//保存形式変更の為
	if ( !$.isArray( list ) ) { list = []; }

	list.forEach(function( value ) {
		var { sx, sy, ex, sy, arrival } = value,
			key = [ sx, sy, ex, sy, arrival ].join('/'),
			idx;

		if ( !keylist[ key ] ) { keylist[ key ] = { new: 0, old: 0, data: [] }; }
		idx = keylist[ key ].old++;
		keylist[ key ].data[ idx ] = value;
	});

	$('.ig_fight_statusarea').each(function() {
		var $this = $(this),
			$panel = $this.find('.paneltable'),
			user, type, arrival, $a, sbase, ebase, key, idx, data;

		//城主名
		user = $this.find('H3 A').text();

		//拠点種別
		type = $panel.find('TR:eq(0) TD:eq(0) SPAN').text().trim();

		//着弾時間
		arrival = $panel.find('TR:eq(0) TD:eq(1)').text();
		arrival = arrival.replace(/^[ \t\n]+/, '').match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)[ 0 ];
		arrival = arrival.getTime();

		//発射地点情報
		$a = $panel.find('A').eq( 0 );
		sbase = $a.text();
		var [ dummy, sx, sy, sc ] = $a.attr('href').match(/x=(-?\d+)&y=(-?\d+)&c=(\d+)/);

		//着弾地点情報
		$a = $panel.find('A').eq( 1 );
		ebase = $a.text();
		var [ dummy, ex, ey, ec ] = $a.attr('href').match(/x=(-?\d+)&y=(-?\d+)&c=(\d+)/);

		key = [ sx, sy, ex, sy, arrival ].join('/');
		if ( !keylist[ key ] ) { keylist[ key ] = { new: 0, old: 0 }; }
		idx = keylist[ key ].new++;

		if ( keylist[ key ].new > keylist[ key ].old ) {
			$panel.addClass('imc_new_enemy');
			alermFlg = true;
			newlist.push({
				user: user,
				sbase: sbase, sx: sx.toInt(), sy: sy.toInt(), sc: sc.toInt(),
				ebase: ebase, ex: ex.toInt(), ey: ey.toInt(), ec: ec.toInt(),
				type: type, arrival: arrival, newenemy: true
			});
		}
		else {
			data = keylist[ key ].data[ idx ];
			delete data.newenemy;
			newlist.push( data );
		}

		baselist[ ebase ] = true;
	});

	storage.set('敵襲', newlist);

	//敵襲が来ている拠点の色を変更する
	$('#sideboxBottom .basename LI *:first-child').each(function() {
		var $this = $(this),
			name = $this.text().trim();

		if ( baselist[ name ] ) {
			$this.parent().addClass('imc_enemy');
		}
	});

	if ( alermFlg && Data.sounds.enemy_raid ) {
		//アラーム
		var audio = new Audio( Data.sounds.enemy_raid );
		audio.volume = 0.6;
		audio.loop = true;
		audio.play();
	}

	var timer = setTimeout(function() { clearTimeout(timer); location.reload(); }, 20 * 1000);
}

});

//■ /facility/set_unit
Page.registerAction( 'facility', 'set_unit', {

//. style
style: '' +
'#team_fighting INPUT { ime-mode: disabled; }' +
'#team_fighting .cntchangetitle { padding-top: 10px; }' +
'#team_fighting BUTTON { width: 60px; }' +
'#imi_soldier_pool { margin-top: 10px; color: #000; }' +
'.imc_table TD { text-align: right; }' +
'',

//. main
main: function() {
	if ( $('#set_unit_form').length == 1 ) {
		this.layouter();
	}
},

//. layouter
layouter: function() {
	this.commandButton();
	this.showSoldierPool();

	$('#team_fighting')
	.on('click', 'SPAN', function() {
		$('#imi_soldier_pool').trigger('update');
	})
	.on('change', function() {
		$('#imi_soldier_pool').trigger('update');
	});
},

//. commandButton
commandButton: function() {
	$('#team_fighting')
	.on('click', 'BUTTON', function() {
		var text = $(this).text(),
			type = $('#unit_id_arr\\[0\\]').val(),
			num = $('#unit_count_arr\\[0\\]').val();

		if ( text == '同兵種' ) {
			$('#team_job SELECT').val( type );
		}
		else if ( text == '同兵数' ) {
			$('#team_cntchange INPUT[type="text"]').val( num );
		}
		else if ( text == '全兵１' ) {
			$('#team_cntchange INPUT[type="text"]').val( 1 );
		}

		$('#imi_soldier_pool').trigger('update');
		return false;
	});

	$('.job_stitle').html('<button>同兵種</button>');
	$('.cntchangetitle').html('<button>同兵数</button><button>全兵１</button>');
},

//. showSoldierPool
showSoldierPool: function() {
	var pool = {};

	$.each( Soldier.typeKeys, function( type ) {
		var $span = $('#pool_unit_now_' + type ),
			num;

		if ( $span.length == 0 ) { return; }

		pool[ type ] = $span.text().toInt();
	});

	$('#ig_boxInner > DIV:not("#sidebar")').each(function() {
		var card = new LargeCard( this ),
			type = Soldier.getType( card.solName );

		pool[ type ] += card.solNum;
	});

	$('#team_fighting').after('<div id="imi_soldier_pool" />');

	$('#imi_soldier_pool')
	.on('update', function() {
		var len = $('.job_s').length,
			reserve = {}, html = '', idx = 0;

		for ( var i = 0; i < len; i++ ) {
			let type = $('#unit_id_arr\\[' + i + '\\]').val(),
				num = $('#unit_count_arr\\[' + i + '\\]').val();

			if ( !reserve[ type ] ) { reserve[ type ] = 0; }
			reserve[ type ] += num.toInt();
		};

		html += '<tr>' +
			'<th style="width: 58px;">兵種</th><th style="width: 42px;">全体</th><th style="width: 42px;">待機</th><th style="width: 42px;">部隊</th>'.repeat( 3 ) +
		'</tr>';

		$.each( pool, function( type ) {
			if ( pool[ type ] == 0 ) { return; }

			if ( idx % 3 == 0 ) { html += '<tr style="height: 18px;">'; }

			html += '<th>' + Soldier.getNameByType( type ) + '</th>';
			html += '<td>' + pool[ type ] + '</td>';
			if ( reserve[ type ] > pool[ type ] ) {
				html += '<td style="color: #f33; font-weight: bold;">' + ( pool[ type ] - ( reserve[ type ] || 0 ) ) + '</td>';
				html += '<td style="color: #f33; font-weight: bold;">' + ( reserve[ type ] || '0' ) + '</td>';
			}
			else {
				html += '<td>' + ( pool[ type ] - ( reserve[ type ] || 0 ) ) + '</td>';
				html += '<td>' + ( reserve[ type ] || '0' ) + '</td>';
			}

			idx++;
			if ( idx % 3 == 0 ) { html += '</tr>'; }
		});

		if ( idx % 3 != 0 ) { html += '<td></td></tr>'; }
		html = '<table class="imc_table">' + html + '</table>';

		$(this).html( html );
	}).trigger('update');
}

});

//■ /facility/set_unit_list
Page.registerAction( 'facility', 'set_unit_list', {

//. style
style: '' +
'TD INPUT { ime-mode: disabled; }' +

'.imc_rarity { float: left; margin-right: 5px; }' +
'#imi_bottom_container .ig_solder_commentarea { position: relative; float: left; height: 34px; padding: 2px; margin: 7px 15px; }' +
'#imi_bottom_container TABLE.imc_soldier_total { position: relative; font-size: 10px; background-color: #eed; margin: 7px 0px; }' +
'#imi_bottom_container TABLE.imc_soldier_total TH { width: 45px; padding: 3px 3px; line-height: 1.2; }' +
'.imc_set_value { color: #060; font-size: 12px; text-decoration: underline; cursor: pointer; }' +

'.imc_command_selecter { margin-top: 10px; }' +
'.imc_command_selecter LI .imc_pulldown { position: absolute; margin: 1px -1px; width: 65px; background-color: #000; border: solid 1px #fff; z-index: 2000; display: none; }' +
'.imc_command_selecter LI A.imc_pulldown_item { padding: 5px; text-indent: 0px; width: auto !important; height: 20px; line-height: 20px; color: #fff; background: #000 none; display: block; }' +
'.imc_command_selecter LI A:hover { color: #fff; background-color: #666; }' +

'#busho_info SELECT.force_type2 { font-size: 13px; width: auto; }' +
'#busho_info INPUT.force_size { font-size: 13px; width: 45px; }' +
'#busho_info .icon_rank DIV { margin: 3px auto; }' +
'#busho_info .rank { color: #f00; }' +

/* 兵種による色分け */
'#busho_info .yari1 TD:nth-child(10) { background-color: #bd9; color: #000; font-size: 12px; }' +
'#busho_info .yari2 TD:nth-child(10) { background-color: #bd9; color: #000; font-size: 12px; }' +
'#busho_info .yari3 TD:nth-child(10) { background-color: #9b7; color: #000; font-size: 12px; }' +
'#busho_info .yari4 TD:nth-child(10) { background-color: #bd9; color: #000; font-size: 12px; }' +

'#busho_info .yumi1 TD:nth-child(10) { background-color: #fcb; color: #000; font-size: 12px; }' +
'#busho_info .yumi2 TD:nth-child(10) { background-color: #fcb; color: #000; font-size: 12px; }' +
'#busho_info .yumi3 TD:nth-child(10) { background-color: #da9; color: #000; font-size: 12px; }' +
'#busho_info .yumi4 TD:nth-child(10) { background-color: #fcb; color: #000; font-size: 12px; }' +

'#busho_info .kiba1 TD:nth-child(10) { background-color: #fe8; color: #000; font-size: 12px; }' +
'#busho_info .kiba2 TD:nth-child(10) { background-color: #fe8; color: #000; font-size: 12px; }' +
'#busho_info .kiba3 TD:nth-child(10) { background-color: #dc6; color: #000; font-size: 12px; }' +
'#busho_info .kiba4 TD:nth-child(10) { background-color: #fe8; color: #000; font-size: 12px; }' +

'#busho_info .heiki1 TD:nth-child(10) { background-color: #c9c; color: #000; font-size: 12px; }' +
'#busho_info .heiki2 TD:nth-child(10) { background-color: #c9c; color: #000; font-size: 12px; }' +
'#busho_info .heiki3 TD:nth-child(10) { background-color: #c9c; color: #000; font-size: 12px; }' +
'#busho_info .heiki4 TD:nth-child(10) { background-color: #dbd; color: #000; font-size: 12px; }' +
'#busho_info .heiki5 TD:nth-child(10) { background-color: #b9b; color: #000; font-size: 12px; }' +
'#busho_info .heiki6 TD:nth-child(10) { background-color: #b9b; color: #000; font-size: 12px; }' +

/* 合成カード選択 */
'#busho_info TR.imc_selected > TD { background-color: rgba( 0, 153, 204, 0.4 ); }' +
'#busho_info TR.imc_added > TD { background-color: rgba( 0, 153, 204, 0.8 ); }' +

/* ソート条件選択用 */
'.ig_decksection_innermid > DIV:first-child { width: 705px; padding: 3px 0px; border: solid 1px #cc9; border-radius: 5px; box-shadow: 3px 3px 3px rgba(0,0,0,0.8); }' +
'.ig_decksection_innermid > DIV:first-child SELECT { margin-right: 10px; }' +
'#imi_order_open { margin-left: 40px; padding: 3px 2px 2px 3px; color: #000; border: solid 1px #666; border-radius: 3px; cursor: pointer; }' +
'#imi_order_open:hover { color: #fff; background-color: #09f; border-color: #069; }' +
'#imi_order_open.imc_is_open:after { content: "▲" }' +
'#imi_order_open.imc_is_close:after { content: "▼" }' +
'#imi_cardorder_list { position: absolute; clear: both; left: 26px; padding: 10px; width: 700px; min-height: 35px; background-color: #F3F2DE; border: solid 1px #cc9; border-top: none; border-radius: 0px 0px 5px 5px; box-shadow: 3px 3px 3px rgba(0,0,0,0.8); z-index: 10; }' +
'#imi_cardorder_list LI { padding: 3px 5px; border-bottom: solid 1px #cc9; font-size: 12px; letter-spacing: 2px; color: #000; text-align: left; }' +
'#imi_cardorder_list INPUT { width: 400px; }' +
'#imi_cardorder_list .imc_order_title { display: inline-block; margin-bottom: -2px; padding-top: 1px; width: 500px; cursor: default; white-space: nowrap; overflow: hidden; }' +
'#imi_cardorder_list .imc_command { display: inline-block; width: 186px; text-align: right; }' +
'#imi_cardorder_list .imc_command SPAN { margin: 0px 2px; padding: 2px 4px; border-radius: 5px; cursor: pointer; }' +
'#imi_cardorder_list .imc_command SPAN:hover { color: #fff; background-color: #09f; }' +

/* 部隊編成 */
'#imi_button_container { padding-bottom: 5px; }' +
'#imi_button_container IMG { margin: 0px 3px 0px 0px; }' +
'#imi_button_container BUTTON { margin-right: 5px; }' +
'',

//. main
main: function() {
	var self = this;

	$.Deferred().resolve()
	.pipe(function() {
		var num = $('#deck_file SELECT[name="show_num"]').val(),
			groupclass = $('#btn_category').find('LI[class$="_on"]').attr('class') || '00',
			group = groupclass.match(/0(\d)/)[ 1 ];

		if ( num != '100' ) { return; }
		if ( $('UL.pager').length == 0 ) { return; }

		//２頁目取得
		return $.post( '/facility/set_unit_list.php', { show_num: num, p: 2, select_card_group: group })
		.pipe(function( html ) {
			var $html = $(html),
				$tr = $html.find('#busho_info > TBODY > TR').slice( 1 );

			//カード情報
			$html.find('#ig_boxInner > DIV[id^="cardWindow"]').appendTo( '#ig_boxInner' );
			$('#busho_info').append( $tr );

			unsafeWindow.unit_brigade_btn_func();
		});
	})
	.pipe(function() {
		var deck = $('#deck_file IMG[src$="btn_deck.png"]').length,
			edit = $('#deck_file IMG[src$="btn_max.png"]').length,
			$th = $('#busho_info > TBODY > TR').eq( 0 ).find('TH');

		self.layouter();
		if ( deck ) {
			if ( edit ) { self.layouter2(); }
		}
		else {
			self.unionMode();
		}
		self.analyze( deck, edit );
		self.cardOrderSelecter();

		$th.eq( 0 ).width( 135 );
		$th.eq( 3 ).hide();
		$th.eq( 4 ).text('槍/弓');
		$th.eq( 5 ).hide();
		$th.eq( 6 ).text('馬/器');
		$th.eq( 7 ).width( 90 );
		$th.eq( 8 ).width( 155 );
		$('.icon_rank:even').hide();
	});
},

//. layouter
layouter: function() {
	var self = this,
		$table = $('#busho_info'),
		num = $('#deck_file SELECT[name="show_num"]').val(),
		html;

	$table
	.on('change', 'SELECT', function() {
		var $this = $(this),
			$input = $this.closest('.tr_gradient').find('INPUT[type="text"]'),
			$button = $this.closest('.tr_gradient').find('INPUT[type="button"]'),
			type = $this.val(),
			value = $input.val();

		if ( type == '' ) {
			$input.val('0');
		}
		else if ( value == '0' ) {
			$input.val('1');
		}

		$button.click();
	})
	.on('click', '.imc_set_value', function() {
		var $this = $(this),
			$input = $this.closest('.tr_gradient').find('INPUT[type="text"]'),
			$button = $this.closest('.tr_gradient').find('INPUT[type="button"]'),
			value = $this.find('SPAN').text();

		$input.val( value );
		$button.click();

		return false;
	});

	$table.find('> TBODY > TR').not('.tr_gradient').remove();

	//表示件数とページャーを削除
	if ( num == 100 ) {
		$('UL.pager').remove();
	}

	//コマンド
	html = '' +
	'<ul id="imi_batch_selecter" class="imc_command_selecter" style="float: right; margin-right: 15px; display: none;">' +
		'<li id="imi_batch_0"><span>兵最大</span></li>' +
		'<li id="imi_batch_1"><span>兵１</span></li>' +
	'</ul>' +
	'<ul id="imi_command_selecter" class="imc_command_selecter">' +
		'<li class="imc_all imc_selected" selecter=".imc_all" batch="0"><span>全て</span></li>' +
		'<li class="imc_yari" selecter=".yari1, .yari2, .yari3, .yari4" batch="0"><span>槍</span></li>' +
		'<li class="imc_yumi" selecter=".yumi1, .yumi2, .yumi3, .yumi4" batch="0"><span>弓</span></li>' +
		'<li class="imc_kiba" selecter=".kiba1, .kiba2, .kiba3, .kiba4" batch="0"><span>馬</span></li>' +
		'<li class="imc_heiki" selecter=".heiki1, .heiki2, .heiki3, .heiki4, .heiki5, .heiki6" batch="0"><span>兵器</span></li>' +
	'</ul>';

	$('#bar_card').first().before( html );

	$('#imi_batch_selecter')
	.on('click', '#imi_batch_0', function() {
		var brigade = $('#btn_category LI[class$="_on"]').attr('class').match(/0(\d)/)[ 1 ],
			batch = $('#imi_command_selecter LI.imc_selected').attr('batch').toInt(),
			post_data;

		$('#now_unit_type').val( batch );
		$('#now_group_type').val( brigade );
		$('#edit_unit_type').val('now_unit');
		$('#edit_unit_count').val('max_unit_count');

		$('#frmlumpsum').append('<INPUT type="hidden" name="btnlumpsum" value="true">');
		$('#frmlumpsum').submit();
	})
	.on('click', '#imi_batch_1', function() {
		var brigade = $('#btn_category LI[class$="_on"]').attr('class').match(/0(\d)/)[ 1 ],
			batch = $('#imi_command_selecter LI.imc_selected').attr('batch').toInt(),
			post_data;

		$('#now_unit_type').val( batch );
		$('#now_group_type').val( brigade );
		$('#edit_unit_type').val('now_unit');
		$('#edit_unit_count').val('1');

		$('#frmlumpsum').append('<INPUT type="hidden" name="btnlumpsum" value="true">');
		$('#frmlumpsum').submit();
	});

	$('#imi_command_selecter')
	.click(function() {
		var $selected = $(this).find('LI.imc_selected'),
			selecter = $selected.attr('selecter'),
			batch = $selected.attr('batch').toInt(),
			$tr = $table.find('TR.tr_gradient').slice( 1 ),
			len = 0;

		if ( selecter == '.imc_all' ) {
			$tr.show();
		}
		else {
			len = $tr.hide().filter( selecter ).show().length;
		}

		if ( num == 100 && batch > 0 && len > 0 ) {
			$('#imi_batch_selecter').show();
		}
		else {
			$('#imi_batch_selecter').hide();
		}
	})
	.find('LI').click(function() {
		$('#imi_command_selecter').find('LI.imc_selected').removeClass('imc_selected');
		$(this).addClass('imc_selected');
	});

	createMenu( $('.imc_all'), [
		{ title: '全て', selecter: '.imc_all', batch: 0 },
		{ title: '無し', selecter: '.imc_none', batch: 0 }
	]);

	createMenu( $('.imc_yari'), [
		{ title: '槍', selecter: '.yari1, .yari2, .yari3, .yari4', batch: 0 },
		{ title: '武士', selecter: '.yari3', batch: 323 },
		{ title: '長槍足軽', selecter: '.yari2', batch: 322 },
		{ title: '足軽', selecter: '.yari1', batch: 321 },
		{ title: '国人衆', selecter: '.yari4', batch: 324 }
	]);

	createMenu( $('.imc_yumi'), [
		{ title: '弓', selecter: '.yumi1, .yumi2, .yumi3, .yumi4', batch: 0 },
		{ title: '弓騎馬', selecter: '.yumi3', batch: 327 },
		{ title: '長弓兵', selecter: '.yumi2', batch: 326 },
		{ title: '弓足軽', selecter: '.yumi1', batch: 325 },
		{ title: '海賊衆', selecter: '.yumi4', batch: 328 }
	]);

	createMenu( $('.imc_kiba'), [
		{ title: '馬', selecter: '.kiba1, .kiba2, .kiba3, .kiba4', batch: 0 },
		{ title: '赤備え', selecter: '.kiba3', batch: 331 },
		{ title: '精鋭騎馬', selecter: '.kiba2', batch: 330 },
		{ title: '騎馬兵', selecter: '.kiba1', batch: 329 },
		{ title: '母衣衆', selecter: '.kiba4', batch: 332 }
	]);

	createMenu( $('.imc_heiki'), [
		{ title: '兵器', selecter: '.heiki1, .heiki2, .heiki3, .heiki4, .heiki5, .heiki6', batch: 0 },
		{ title: '騎馬鉄砲', selecter: '.heiki5', batch: 337 },
		{ title: '雑賀衆', selecter: '.heiki6', batch: 338 },
		{ title: '鉄砲足軽', selecter: '.heiki4', batch: 336 },
		{ title: '大筒兵', selecter: '.heiki3', batch: 335 },
		{ title: '攻城櫓', selecter: '.heiki2', batch: 334 },
		{ title: '破城鎚', selecter: '.heiki1', batch: 333 }
	]);

	function createMenu( target, menu ) {
		var submenu = $('<div class="imc_pulldown" />');

		$.each( menu, function() {
			if ( !( 'title' in this ) ) { return; }

			var $a = $('<a class="imc_pulldown_item" />').text( this.title );

			$a.attr({ href: 'javascript:void(0);', selecter: this.selecter, batch: this.batch });

			submenu.append( $a );
		});

		if ( submenu.children().length == 0 ) { return; }

		target
		.append( submenu )
		.hover(
			function() { submenu.show(); },
			function() { submenu.hide(); }
		);

		target.find('A').click(function() {
			var $this = $(this),
				$li = $this.closest('LI');

			$li.find('SPAN').text( $this.text() );
			$li.attr( 'selecter', $this.attr('selecter') );
			$li.attr( 'batch', $this.attr('batch') );

			submenu.hide();
		});
	}
},

//. layouter2
layouter2: function() {
	$('#deck_file > A').wrapAll('<DIV id="imi_button_container" />').children('IMG').removeClass('mb5');

	$('#imi_button_container')
	.append('<span style="float: right; margin-right: 30px;"><button>同兵種</button><button>同兵数</button><button>全兵１</button></span>')
	.on('click', 'BUTTON', function() {
		var text = $(this).text(),
			type = $('#busho_info SELECT').first().val(),
			num = $('#busho_info INPUT[type="text"]').first().val();

		if ( text == '同兵種' ) {
			$('#busho_info SELECT').val( type );
		}
		else if ( text == '同兵数' ) {
			$('#busho_info INPUT[type="text"]').val( num );
		}
		else if ( text == '全兵１' ) {
			$('#busho_info INPUT[type="text"]').val( 1 );
		}

		$('#imi_soldier_pool').trigger('update');
		return false;
	});
},

//. cardOrderSelecter
cardOrderSelecter: function() {
	var $span = $('<span id="imi_order_open" class="imc_is_close" />'),
		$div = $('<div id="imi_cardorder_list" />').hide();

	//デッキ画面では両方マッチしてしまうためlastを使用
	$('.center_posi, #selectarea').last().append( $span );
	$('#ig_deck_cardlistmenu2, .center_posi').append( $div );

	$span.toggle(
		function() {
			$('#imi_cardorder_list').trigger('update').show();
			$(this).removeClass('imc_is_close').addClass('imc_is_open');
		},
		function() {
			$('#imi_cardorder_list').hide();
			$(this).removeClass('imc_is_open').addClass('imc_is_close');
		}
	);

	$('#selectarea, #deck_file').on('change', 'SELECT', function() {
		//ソート項目が重複したとき、後ろの項目を「未設定」にする
		var keylist = {};
		$('#selectarea .sortGenre').each(function() {
			var $this = $(this),
				key = $this.val();

			if ( key == '0' ) { return; }

			if ( keylist[ key ] ) {
				$this.val('0');
				Display.alert('ソート項目が重複しています。');
			}
			keylist[ key ] = true;
		});

		$('#imi_cardorder_list').trigger('update');
	});

	$div
	.on('mouseenter', 'LI', Util.enter)
	.on('mouseleave', 'LI', Util.leave)
	.on('keypress', 'INPUT', function( e ) { return !( e.keyCode == 13 ); })
	.on('update', function() {
		var orderlist = MetaStorage('SETTINGS').get('cardsort') || {},
			$div = $(this),
			$ul = $('<ul/>'),
			$li, order, title, html, idx = 1;

		$div.empty();

		$.each( orderlist, function( order ) {
			var title, html, $li;

			title = this.title || generateTitle( order );

			html = '<li>' +
				'<span class="imc_order_title">' + title + '</span>' +
				'<span class="imc_command">' +
					( ( idx == 1 ) ? '' : '<span class="imc_up">↑</span>|' ) +
					'<span class="imc_delete">×</span>' +
					'|<span class="imc_name_change">名称変更</span>' +
					'|<span class="imc_order_select">決定</span>' +
				'</span>' +
			'</li>';

			$li = $( html ).data({ idx: idx, order: order });
			$ul.append( $li );

			idx += 2;
		});

		order = [
			$('#sort_order_0').val(),
			$('#sort_order_type_0').val(),
			$('#sort_order_1').val(),
			$('#sort_order_type_1').val(),
			$('#sort_order_2').val(),
			$('#sort_order_type_2').val(),
		].join('/');

		if ( !orderlist[ order ] ) {
			//登録されていないソート順の場合、新規登録できるようにする
			title = generateTitle( order );

			html = '<li class="imc_newdata">' +
				'<span class="imc_order_title">' + title + '</span>' +
				'<span class="imc_command">' +
					'<span class="imc_register">新規登録</span>' +
				'</span>' +
			'</li>';

			$li = $( html ).data('order', order);
			$ul.append( $li );
		}

		$div.append( $ul );
	})
	.on('click', '.imc_register', function() {
		var order = $(this).closest('LI').data('order'),
			orderlist = MetaStorage('SETTINGS').get('cardsort') || {};

		orderlist[ order ] = {};
		MetaStorage('SETTINGS').set('cardsort', orderlist);

		$('#imi_cardorder_list').trigger('update');
	})
	.on('click', '.imc_up', function() {
		var $this = $(this),
			$li = $this.closest('LI'),
			orderlist = MetaStorage('SETTINGS').get('cardsort') || {},
			newlist = {};

		$li.data( 'idx', $li.data('idx') - 3 );

		$this.closest('UL').find('LI:not(".imc_newdata")').map(function() {
			return $(this).data();
		}).get()
		.sort(function( a, b ) {
			return ( a.idx > b.idx );
		})
		.forEach(function( value ) {
			var order = value.order;
			newlist[ order ] = orderlist[ order ];
		});

		MetaStorage('SETTINGS').set('cardsort', newlist);

		$('#imi_cardorder_list').trigger('update');
	})
	.on('click', '.imc_delete', function() {
		var order = $(this).closest('LI').data('order'),
			orderlist = MetaStorage('SETTINGS').get('cardsort') || {};

		delete orderlist[ order ];
		MetaStorage('SETTINGS').set('cardsort', orderlist);

		$('#imi_cardorder_list').trigger('update');
	})
	.on('click', '.imc_order_select', function() {
		var order = $(this).closest('LI').data('order'),
			array = order.split('/');

		$('#sort_order_0').val( array[ 0 ] );
		$('#sort_order_type_0').val( array[ 1 ] );
		$('#sort_order_1').val( array[ 2 ] );
		$('#sort_order_type_1').val( array[ 3 ] );
		$('#sort_order_2').val( array[ 4 ] );
		$('#sort_order_type_2').val( array[ 5 ] );

		$('.sortSubmit').click();
	})
	.on('click', '.imc_name_change', function() {
		var $li = $(this).closest('LI'),
			$title = $li.find('.imc_order_title'),
			$command = $li.find('.imc_command'),
			title = $title.text();

		$title.empty().append('<input type="text" value="' + title + '" />');
		$command.empty().append('<span class="imc_name_change_ok">決定</span>｜<span class="imc_name_change_cancel">キャンセル</span>');
	})
	.on('click', '.imc_name_change_ok', function() {
		var $li = $(this).closest('LI'),
			order = $li.data('order'),
			title = $li.find('INPUT').val(),
			orderlist = MetaStorage('SETTINGS').get('cardsort') || {};

		if ( orderlist[ order ] ) {
			if ( title == '' ) {
				delete orderlist[ order ].title;
			}
			else {
				orderlist[ order ].title = title;
			}
			MetaStorage('SETTINGS').set('cardsort', orderlist);
		}

		$('#imi_cardorder_list').trigger('update');
	})
	.on('click', '.imc_name_change_cancel', function() {
		$('#imi_cardorder_list').trigger('update');
	});

	function generateTitle( order ) {
		var array = order.split('/'),
			title = '';

		for ( var i = 0, len = array.length; i < len; i += 2 ) {
			let idx = Math.floor( i / 2 );

			title += ( title == '' ) ? '' : ' ／ ';
			title += $( '#sort_order_' + idx ).find('OPTION[value=' + array[ i ] + ']').text();
			title += ' 【';
			title += $( '#sort_order_type_' + idx ).find('OPTION[value=' + array[ i + 1 ] + ']').text();
			title += '】';
		}

		return title;
	}
},

//. unionMode
unionMode: function() {
	$('#busho_info .tr_gradient').slice( 1 )
	.contextMenu( this.contextmenu )
	.on('click', function( e ) {
		var $this = $(this),
			data = $this.data(),
			$target = $( e.target );

		if ( $target.is('A') ) { return; }

		if ( !$target.is('TD') ) {
			$target = $target.closest('TD');
		}

		var idx = $this.children('TD').index( $target );
		if ( !( 1 <= idx && idx <= 8 ) ) { return; }

		var len = $('TR.imc_selected').length;

		if ( ( len == 0 && !data.canUnion() ) || ( len >= 1 && !data.useMaterial() ) ) {
			Display.info('このカードは合成に使用できません。');
			return;
		}

		if ( $this.hasClass('imc_selected') ) {
			$this.removeClass('imc_selected imc_added');
		}
		else if ( len < 6 ) {
			$this.addClass('imc_selected');

			if ( $('.imc_added').length == 0 ) {
				$this.addClass('imc_added');
			}
		}
		else {
			Display.info('これ以上選択できません。');
		}
	});
},

//. analyze
analyze: function( deck, edit ) {
	var $tr = $('#busho_info .tr_gradient').slice( 1 );

	$tr.each(function() {
		var $this  = $(this),
			$input = $this.find('INPUT'),
			$td  = $this.children('TD'),
			idx  = $input.eq( 0 ).val(),
			id   = $input.eq( 1 ).val(),
			card = new LargeCard( $( '#cardWindow_' + id ) ),
			data = Soldier.getByName( card.solName );

		$this.data( card );

		$td.eq( 1 ).find('A DIV DIV').css({ position: 'relative', left: '1px' }).unwrap();

//		$td.eq( 5 ).append( $td.eq( 6 ).children() );
//		$td.eq( 7 ).append( $td.eq( 8 ).children() );
		$td.eq( 6 ).prepend( $td.eq( 5 ).children() );
		$td.eq( 8 ).prepend( $td.eq( 7 ).children() );

		//兵士数
		if ( card.solNum == card.maxSolNum ) {
			$this.find( '#unit_cnt_text_' + idx ).css({ backgroundColor: '#fbb' });
		}

		if ( data ) {
			//背景色設定
			$this.addClass( data.class );
		}
		else {
			$this.addClass('imc_none')
		}

		//HP
		if ( card.hp < ( card.maxHp - 10 ) ) { $td.slice( 1, 3 ).css({ backgroundColor: '#955' }); }
		else if ( card.hp < card.maxHp ) { $td.slice( 1, 3 ).css({ backgroundColor: '#644' }); }

		if ( !( deck && !edit ) ) {
			$this.find('TABLE').eq( 1 ).find('TR').eq( 1 ).find('TD').eq( 0 ).prepend('<span class="font_purple imc_set_value">( <span>1</span> )</span> / ');
			$( '#unit_set_link' + idx ).removeAttr('onclick style').addClass('imc_set_value');
		}
	});
},

//. contextmenu
contextmenu: function() {
	var $this = $(this),
		card = $this.data(),
		card_id = card.cardId,
		selected = $this.hasClass('imc_selected'),
		added_card = $('.imc_added').data(),
		added_cid = ( added_card || { cardId: '' } ).cardId,
		material_cid = $.map( $('TR.imc_selected'), function( value ) {
			if ( $( value ).hasClass('imc_added') ) { return null; }

			return ( $( value ).data() || { cardId: null } ).cardId;
		}),
		menu = {}, submenu, separator = false;

	menu[ card.name ] = $.contextMenu.title;

	//合成可能な場合のメニュー
	if ( card.canUnion() && !selected ) {
		if ( card.canRankup() ) {
			//素材カードが指定されている場合、ランクとレベルチェック
			if ( added_card && ( added_card.lv < 20 || added_card.rank < card.rank ) ) {
				//条件を満たしていない場合、表示しない
			}
			else {
				menu['ランクアップする'] = function() { Card.rankup( card_id, added_cid, material_cid ); };
				separator = true;
			}
		}
		if ( card.canSkillLvup() ) {
			menu['スキルを強化する'] = function() { Card.skillLevelup( card_id, added_cid, material_cid ); };
			separator = true;
		}
		if ( card.canSkillAdd() ) {
			menu['スキルを追加する'] = function() { Card.skillAdd( card_id, added_cid ); };
			separator = true;
		}
		if ( card.canSkillRemove() ) {
			menu['スキルを削除する'] = function() { Card.skillRemove( card_id ); };
			separator = true;
		}
	}

	if ( separator ) { menu['セパレーター1'] = $.contextMenu.separator; }

	submenu = {};
	submenu[ '「' + card.name + '」を検索' ] = function() { Util.searchTradeCardNo( card.cardNo ); };
	submenu['セパレーター1'] = $.contextMenu.separator;

	card.skillList.forEach(function( skill ) {
		submenu[ '「' + skill.name + '」を検索' ] = function() { Util.searchTradeSkill( skill.name ); };
	});

	menu['取引検索'] = submenu;

	return menu;
}

});

//■ /card/deck
Page.registerAction( 'card', 'deck', {

//. style
style: '' +
/* デッキ用 */
'#ig_deckcost { top: 8px; left: 160px; }' +
'#ig_keikenup { top: 8px; left: 500px }' +
'#ig_deckheadmenubox { height: 80px; }' +
'#ig_bg_decksection1right { min-height: 400px; }' +
'#deck_skill_display { top: 188px; }' +
'DIV.deck_select_lead { display: none; }' +

/* ユニットデータ表示用 */
'.imc_deck_unitdata { width: 114px; height: 18px; line-height: 18px; font-size: 13px; font-weight: bold; color: #300; padding-left: 95px; padding-bottom: 3px; border-bottom: dotted 1px #666; display: inline-block; }' +
'.imc_deck_unitdata_speed { width: 40px; height: 18px; line-height: 18px; font-size: 13px; font-weight: bold; color: #300; padding-left: 55px; padding-bottom: 3px; display: inline-block; }' +
'.ig_deck_unitdata_allcost { width: 40px; display: inline-block; }' +

/* 全部隊解散ボタン用 */
'#imi_unregist_all { position: absolute; top: 53px; left: 260px; cursor: pointer; }' +

/* 小カード用 */
'.ig_deck_smallcardtitle { height: 17px; margin-bottom: 2px; }' +
'.ranklvup_m { top: -75px; width: 0px; }' +
'.ig_deck_smallcardimage .ranklvup_m .rankup_btn { width: 0px; }' +
'.ig_deck_smallcardimage .ranklvup_m .rankup_btn A { width: 40px; background-position: -75px 0px; }' +
'.ig_deck_smallcardimage .ranklvup_m .rankup_btn A:hover { width: 105px; background-position: -10px -25px; }' +
'.ig_deck_smallcardimage .ranklvup_m .levelup_btn { width: 0px; }' +
'.ig_deck_smallcardimage .ranklvup_m .levelup_btn A { width: 40px; background-position: -75px 0px; }' +
'.ig_deck_smallcardimage .ranklvup_m .levelup_btn A:hover { width: 105px; background-position: -10px -25px; }' +
'SPAN.imc_card_header { float: right; margin-right: 5px; padding-top: 2px; height: 22px; }' +
'.imc_cardname { font-weight: bold; line-height: 17px; }' +
'.imc_card_header SPAN { height: 17px; font-size: 11px; letter-spacing: -1px; line-height: 17px; }' +
'.imc_card_header .imc_lv { margin-top: -1px; font-size: 12px; font-weight: bold; letter-spacing: 0px; }' +
'.imc_card_header .imc_lv_20 { color: #fc9; }' +
'.imc_card_skill { position: relative; top: 116px; background-color: #333; z-index: 4; }' +
'.imc_card_skill TABLE { margin-bottom: 0px; }' +
'.imc_card_skill TH { width: 20px; }' +
'.imc_card_status TH { width: 45px; }' +
'.imc_card_status .imc_solmax { background-color: #642; }' +
'.imc_card_status .imc_power { background-color: #246; }' +
'.imc_card_status .imc_power TD { text-align: right; padding-right: 5px; }' +
/* HP・討伐ゲージ用バー */
'.imc_bar_title { color: white; font-size: 10px; }' +
'.imc_bar_battle_gage { width: 100px; height: 4px; border: solid 1px #c90; border-radius: 2px; background: -moz-linear-gradient(left, #cc0, #c60); margin-bottom: 1px; }' +
'.imc_bar_hp { width: 100px; height: 4px; border: solid 1px #696; border-radius: 2px; background: -moz-linear-gradient(left, #a60, #3a0); }' +
'.imc_bar_inner { background-color: #000; float: right; height: 100%; display: inline-block; }' +
'.imc_recovery_time { width: 110px; height: 29px; line-height: 29px; text-align: center; float: right; }' +
'#ig_deck_smallcardarea_out .ig_deck_smallcardarea { height: 220px; padding-top: 5px; border: solid 1px #666; background: -moz-linear-gradient(top left, #444, #000); }' +
'#ig_deck_smallcardarea_out .ig_deck_smallcardarea.imc_selected { height: 219px; padding: 4px 4px 0px 8px; }' +
'#ig_deck_smallcardarea_out .ig_deck_smallcarddelete { display: none; }' +
'#ig_deck_smallcardarea_out .battlegage2 { display: none; }' +
/* カード選択時の枠色 */
'.imc_deck_mode .imc_selected { border: solid 2px #f80 !important; background: -moz-linear-gradient(top left, #654, #000) !important; }' +
'.imc_union_mode .imc_selected { border: solid 2px #09c !important; background: -moz-linear-gradient(top left, #456, #000) !important; }' +

/* 下部表示欄 */
'.imc_contents { position: relative; width: 916px; padding: 0px 14px 0px 14px; margin: 7px auto; }' +

'#imi_village_info { float: right; margin-right: 16px; }' +
'#imi_village_info .deck_wide_select { padding-bottom: 0px; }' +

'#imi_deck_info { height: 20px; }' +
'#imi_deck_info LI { float: left; min-width: 60px; height: 20px; line-height: 20px; padding: 0px 6px; margin-right: 8px; background-color: #f1f0dc; border: solid 1px #f1f0dc; }' +
'#imi_deck_info .imc_info1 { width: 30px; text-align: right; font-weight: bold; display: inline-block; margin-right: 5px; }' +
'#imi_deck_info .imc_info1_free { width: 25px; text-align: right; display: inline-block; }' +
'#imi_deck_info .imc_info2 { width: 12px; text-align: right; font-weight: bold; display: inline-block; margin-right: 5px; }' +
'#imi_deck_info .imc_info2_free { width: 12px; text-align: right; display: inline-block; }' +
'#imi_deck_info .imc_info3,' +
'#imi_deck_info .imc_info4 { width: 45px; text-align: right; display: inline-block; }' +
'#imi_deck_info .imc_info5 { width: 30px; text-align: right; display: inline-block; }' +

'#imi_deck_info #imi_mode { width: 75px; text-align: center; font-weight: bold; background-color: #000; cursor: pointer; }' +
'#imi_deck_info #imi_mode.imc_deck_mode { border: solid 1px #f80; }' +
'#imi_deck_info #imi_mode.imc_deck_mode:after { content: "デッキモード"; color: #f80; }' +
'#imi_deck_info #imi_mode.imc_union_mode { border: solid 1px #09c; }' +
'#imi_deck_info #imi_mode.imc_union_mode:after { content: "合成モード"; color: #09c; }' +
'#imi_deck_info #imi_mode:hover { color: #fff; border-color: #fff; background-color: #666; }' +

'#imi_new_deck { float: right; margin-right: 16px; }' +
'#imi_new_deck LI { float: right; min-width: 44px; height: 20px; line-height: 20px; text-align: center; padding: 0px 8px; border: solid 1px #666; color: #666; background-color: #000; margin-left: 8px; cursor: pointer; }' +
'#imi_new_deck LI:hover { background-color: #666; border-color: #fff; color: #fff; }' +

'#imi_open.imc_is_open:after { content: "閉じる" }' +
'#imi_open.imc_is_close:after { content: "開く" }' +

/* デッキモード */
'#imi_card_container { display: none; position: relative; width: 998px; height: 200px; margin: 0px auto 5px auto; padding: 5px 0px; background-color: #000; border: solid 1px #970; overflow: hidden; }' +
'#imi_card_container .ig_deck_smallcardarea { height: 190px; border-bottom: solid 1px #666; }' +
/* 合成モード */
'#imi_card_container1 { display: none; position: relative; width: 1000px; height: auto; margin: 0px auto 3px auto; background-color: #000; overflow: hidden; }' +
'#imi_card_container2 { display: inline-block; width: 254px; height: 200px; padding: 5px 0px; background-color: #000; border: solid 1px #970; overflow: hidden; }' +
'#imi_card_container2 .ig_deck_smallcardarea { height: 190px; border-bottom: solid 1px #666; }' +
'#imi_card_container3 { display: inline-block; width: 722px; height: 200px; margin-left: 16px; padding: 5px 0px; background-color: #000; border: solid 1px #970; overflow: hidden; }' +
'#imi_card_container3 .ig_deck_smallcardarea { height: 190px; width: 121px; border: solid 1px #666; background-position: -1px -1px; }' +
'#imi_card_container2:after { content: "　素材カード"; color: #999; font-size: 18px; line-height: 200px; }' +
'#imi_card_container3:after { content: "　追加素材カード"; color: #999; font-size: 18px; line-height: 200px; }' +

'.imc_command_selecter LI .imc_pulldown { position: absolute; margin: 0px -1px; padding: 2px; background-color: #000; border: solid 1px #fff; z-index: 2000; text-align: left; display: none; }' +
'.imc_command_selecter LI:hover .imc_pulldown { display: block; }' +
'.imc_command_selecter LI A.imc_pulldown_item { padding: 3px 0px; text-indent: 0px; width: 65px !important; height: 20px; line-height: 20px; text-align: center; color: #fff; background: #000 none; display: inline-block; }' +
'.imc_command_selecter LI A:hover { color: #fff; background-color: #666; }' +

/* 兵種変更 */
'#imi_unitedit { margin: auto; width: 350px; }' +
'#imi_unitedit TH:first-child { width: 60px; }' +
'#imi_unitedit TD { width: 40px; cursor: pointer; }' +
'#imi_unitedit TD.imc_disabled { background-color: #ccc; cursor: auto; }' +
'#imi_unitedit .imc_selected { background-color: #f9dea1; }' +

/* ソート条件選択用 */
'#selectarea SELECT { margin-right: 8px; }' +
'#imi_order_open { color: #fff; padding: 3px 2px 2px 3px; border: solid 1px #666; border-radius: 3px; cursor: pointer; }' +
'#imi_order_open:hover { background-color: #09f; border-color: #069; }' +
'#imi_order_open.imc_is_open:after { content: "▲" }' +
'#imi_order_open.imc_is_close:after { content: "▼" }' +
'#imi_cardorder_list { position: relative; clear: both; left: 10px; padding: 10px; width: 727px; min-height: 35px; background-color: #F3F2DE; border-radius: 0px 0px 5px 5px; box-shadow: 5px 5px 5px rgba(0,0,0,0.8); z-index: 10; }' +
'#imi_cardorder_list LI { padding: 3px 5px; border-bottom: solid 1px #cc9; font-size: 12px; letter-spacing: 2px; }' +
'#imi_cardorder_list INPUT { width: 400px; }' +
'#imi_cardorder_list .imc_order_title { display: inline-block; margin-bottom: -2px; padding-top: 1px; width: 530px; text-align: left; cursor: default; white-space: nowrap; overflow: hidden; }' +
'#imi_cardorder_list .imc_command { display: inline-block; width: 186px; text-align: right; }' +
'#imi_cardorder_list .imc_command SPAN { margin: 0px 2px; padding: 2px 4px; border-radius: 5px; cursor: pointer; }' +
'#imi_cardorder_list .imc_command SPAN:hover { color: #fff; background-color: #09f; }' +
'',

//. main
main: function() {
	//デッキ関係の情報保存
	var unit_list = $('#ig_unitchoice LI'),
		ano, deck_cost, free_cost, card_list;

	deck_cost = $('#ig_deckcost').find('SPAN.ig_deckcostdata').text().match(/(\d+\.?\d?)\/(\d+)/);
	free_cost = deck_cost[2].toFloat() - deck_cost[1].toFloat();
	card_list = [];

	//追加の場合、現在選択されているano
	ano = unit_list.index( unit_list.filter('.now').first() );

	$('#id_deck_card1, #id_deck_card2, #id_deck_card3, #id_deck_card4').each(function() {
		var $this = $(this),
			card;

		if ( $this.children().length == 0 ) { return; }
		if ( $this.find('#deck_none').length > 0) { return; }

		card = new LargeCard( $this );
		card_list.push( card );
	});

	Deck.setup( free_cost, ano, card_list );
	this.autoPager();
	this.layouter();
	this.unitPower();
	this.deckSelecter();
	this.villageSelecter();
	this.cardOrderSelecter();

	$('#ig_deck_smallcardarea_out, #imi_mode').addClass('imc_deck_mode');

	var $card_list = $('.ig_deck_smallcardarea')
	.live('click', Deck.addCard )
	.contextMenu( Deck.contextmenu, true );

	SmallCard.setup( $card_list );
	Deck.updateDeckInfo();

	var unit_num = 5 - unit_list.filter('.unset').length,
		cache_num = MetaStorage('UNIT_STATUS').get('部隊').length;

	if ( unit_num != cache_num ) {
		Util.getUnitStatusCD();
	}
},

//. autoPager
autoPager: function() {
	$.autoPager({
		container: '.ig_imgtop:last',
		next: function( html ) {
			var $html = $(html),
				$pager = $html.find('UL.pager.cardstock:first'),
				source = $pager.find('LI.last A:eq(0)').attr('onClick') || '',
				match = source.match(/input.name = "p"; input.value = "(\d+)"/),
				nextPage;

			if ( match ) {
				nextPage = match[1].toInt();
			}

			return nextPage;
		},
		load: function( nextPage ) {
			var page = nextPage,
				ano = $('#assign_form INPUT[name="select_assign_no"]').val(),
				dmo = $('#assign_form INPUT[name="deck_mode"]').val(),
				groupclass = $('#btn_category').find('LI[class$="_on"]').attr('class') || '00',
				group = groupclass.match(/0(\d)/)[ 1 ];

			return Page.post( '/card/deck.php', { myselect: '', ano: ano, dmo: dmo, select_card_group: group, p: page });
		},
		loaded: function( html ) {
			var $html = $(html),
				$card_list = $html.find('#ig_deck_smallcardarea_out').find('.ig_deck_smallcardarea');

			//ポップアップ用
			$('#sidebar').before( $html.find('#ig_boxInner > DIV[id^=cardWindow_]') );

			SmallCard.setup( $card_list );
			$card_list.appendTo('#ig_deck_smallcardarea_out');
			Deck.updateDeckCard();
		},
		ended: function() {
			Display.info('全ページ読み込み完了');
		}
	});
},

//. layouter
layouter: function() {
	var self = this;

	//ヘッダメニュー部
	$('#ig_deckcost').appendTo('#ig_deckheadmenubox');
	$('#ig_deckmenu, #ig_cardreverse').remove();

	//全部隊解散ボタン
	var len = $('#ig_unitchoice li').not(':contains("[---新規部隊を作成---]")').length;
	if ( len > 0 ) {
		$('<img />').attr({ id: 'imi_unregist_all', title: '全部隊解散', src: Data.images.all_breakup })
		.appendTo('#ig_deckheadmenubox')
		.click( this.unregistAll );
	}

	//仮想デッキ用
	var html = '' +
	'<div id="imi_bottom_container">' +
		'<div class="imc_overlay" />' +
		'<div class="imc_contents">' +
			'<ul id="imi_village_info" />' +
			'<ul id="imi_deck_info">' +
				'<li>コスト：<span class="imc_info1"></span>/<span class="imc_info1_free"></span></li>' +
				'<li>武将枠：<span class="imc_info2"></span>/<span class="imc_info2_free"></span></li>' +
				'<li>攻撃力：<span class="imc_info3">0</span></li>' +
				'<li>防御力：<span class="imc_info4">0</span></li>' +
				'<li>速度：<span class="imc_info5">0</span></li>' +
				'<li id="imi_mode"></li>' +
			'</ul>' +
		'</div>' +
		'<div class="imc_contents">' +
			'<ul id="imi_new_deck">' +
				'<li id="imi_open" class="imc_is_close"></li>' +
				'<li id="imi_card_assign">選択武将を部隊へ登録</li>' +
			'</ul>' +
			'<ul id="imi_command_selecter" class="imc_command_selecter" />' +
		'</div>' +
		'<div id="imi_card_container" />' +
		'<div id="imi_card_container1">' +
			'<div id="imi_card_container2" />' +
			'<div id="imi_card_container3" />' +
		'</div>' +
	'</div>';

	$( html ).appendTo('BODY');

	$('#ig_deck_smallcardarea_out')
	.on( 'update', function() {
		Util.countDown();
	});

	$('#imi_bottom_container')
	.on( 'click', '#imi_mode', function() {
		var $this = $(this);

		if ( $this.hasClass('imc_union_mode') ) {
			$('#ig_deck_smallcardarea_out, #imi_mode').removeClass('imc_union_mode').addClass('imc_deck_mode');
		}
		else {
			$('#ig_deck_smallcardarea_out, #imi_mode').removeClass('imc_deck_mode').addClass('imc_union_mode');
		}

		self.changeMode( true );
	})
	.on( 'click', '#imi_open', function() {
		var $this = $(this);

		if ( $this.hasClass('imc_is_close') ) {
			$this.removeClass('imc_is_close').addClass('imc_is_open');
		}
		else {
			$this.removeClass('imc_is_open').addClass('imc_is_close');
		}

		self.changeMode( false );
	})
	.on( 'click', '#imi_card_assign', function() {
		var village_id = $('#imi_select_village').val() || '',
			brigade = $('#btn_category LI[class$="_on"]').attr('class').match(/0(\d)/)[ 1 ],
			unit_id = '';

		if ( village_id == '' ) {
			//拠点IDを取得できない場合、部隊IDチェック
			var href = $('#ig_deck_unititle').find('A').attr('href') || '',
				unit_assign_id = href.match(/unit_assign_id=(\d+)/);

			if ( !unit_assign_id ) {
				//拠点IDも部隊IDも取得できない・・・
				return;
			}

			unit_id = unit_assign_id[ 1 ];
		}

		Deck.assignCard( village_id, unit_id )
		.always(function() {
			Page.move( '/card/deck.php?ano=' + Deck.ano + '&select_card_group=' + brigade );
		});
	})
	.on( 'update', '#imi_deck_info', function() {
		var unit = Deck.currentUnit,
			speed = unit.speed,
			time = ( speed == 0 ) ? 0 : Math.floor( 3600 / speed ),
			dtitle = '破壊力：' + unit.des.toFormatNumber(),
			stitle = time.toFormatTime() + '／距離';

		$('.imc_info1').text( unit.cost.toFixed( 1 ) );
		$('.imc_info1_free').text( Deck.freeCost.toFixed( 1 ) );
		$('.imc_info2').text( unit.card );
		$('.imc_info2_free').text( 4 );
		$('.imc_info3').text( Math.floor( unit.atk ).toFormatNumber() ).parent().attr( 'title', dtitle );
		$('.imc_info4').text( Math.floor( unit.def ).toFormatNumber() );
		$('.imc_info5').text( speed.toRound( 1 ) ).parent().attr( 'title', stitle );

		$('#imi_card_container').empty();
		for ( var i = 0, len = unit.assignList.length; i < len; i++ ) {
			$('#imi_card_container').append( unit.assignList[ i ].clone() );
		}
	});

	Deck.commandMenu( $('#imi_command_selecter'), true );
},

//. unregistAll
unregistAll: function() {
	var len = $('#ig_unitchoice li').not(':contains("[---新規部隊を作成---]")').length,
		tasks = [], ol;

	if ( !confirm('全部隊を解散させます。\nよろしいですか？') ) { return; }

	//オーバーレイ表示
	ol = Display.dialog();
	ol.message('全解散処理開始...');

	for ( var i = len - 1; i >= 0; i-- ) {
		tasks.push( sendData( i ) );
	}

	$.when.apply( $, tasks )
	.pipe(function() {
		var done = 0;

		for ( var i in arguments ) {
			if ( arguments[i] ) { done++; }
		}

		if ( done == 0 ) {
			return $.Deferred().reject();
		}
	})
	.pipe( Util.getUnitStatus )
	.done(function() {
		ol.message('全解散処理終了');
	})
	.fail(function() {
		ol.message('待機中の部隊はありませんでした。');
	})
	.always(function() {
		ol.message('ページを更新します...');
		Page.move( '/card/deck.php' );
	});

	function sendData( idx ) {
		ol.message('デッキ' + ( idx + 1 ) + 'の情報を取得中...');

		return $.get( '/card/deck.php?ano=' + idx )
		.pipe(function( html ) {
			var $html = $(html),
				$a = $html.find('.deck_navi a:first'),
				unit_name, source, arg, post_data;

			if ( $a.length == 0 ) { return null; }

			source = $a.attr('onClick') || '';
			args = source.match(/confirmUnregist\('(\d+)', '(\d+)'/);

			if ( args == null ) { return null; }

			$html.find('#unit_assign_id').val( args[1] );
			$html.find('#unset_unit_squad_id').val( args[2] );
			$html.find('#select_assign_no').val('0');

			post_data = $html.find('#assign_form').serialize();
			unit_name = $html.find('#ig_deck_unititle').text();

			ol.message( unit_name + 'を解散中...' );

			return $.post( '/card/deck.php', post_data );
		});
	}
},

//. unitPower
unitPower: function() {
	var unit = Deck.currentUnit,
		speed = unit.speed,
		time = ( speed == 0 ) ? 0 : Math.floor( 3600 / speed );

	$('#ig_deck_unitdetailbox')
	.prepend(
		$('<span class="imc_deck_unitdata">' + Math.floor( unit.def ) + '</span>')
		.css({ background: 'url(' + Data.images.result_defend + ') no-repeat scroll -3px 0px transparent' })
	)
	.prepend(
		$('<span class="imc_deck_unitdata">' + Math.floor( unit.atk ) + ' / ' + unit.des + '</span>')
		.css({ background: 'url(' + Data.images.result_attack + ') no-repeat scroll -3px 0px transparent' })
	);

	//移動速度
	$('.ig_deck_unitdata_allcost').after(
		$('<span class="imc_deck_unitdata_speed" title="' + time.toFormatTime() + '／距離">' + speed.toRound( 1 ) + '</span>')
		.css({ background: 'url(' + Data.images.result_speed + ') no-repeat scroll -3px -2px transparent' })
	);
},

//. deckSelecter
deckSelecter: function() {
	$('#ig_unitchoice').find('LI').each(function( idx ) {
		var $this = $(this),
			$a = $this.find('A');

		if ( $this.filter(':contains("[---新規部隊を作成---]")').length == 1 ) {
			$this.addClass('unset');
		}

		if ( $a.length == 0 ) { return; }

		var brigade = $('#btn_category LI[class$="_on"]').attr('class').match(/0(\d)/)[ 1 ];
		$a.attr('href', '/card/deck.php?ano=' + idx + '&select_card_group=' + brigade ).removeAttr('onClick');
	});
},

//. villageSelecter
villageSelecter: function() {
	if ( $('#select_village').val() == '' ) {
		var base = $('#imi_basename > .basename .on > SPAN').text();

		$('#select_village > OPTION[label="' + base + '"]').attr('selected', true);
	}

	if ( $('#select_village').length == 0 ) {
		$('.ig_deck_unitdata_assign').clone().appendTo('#imi_village_info');
	}
	else {
		$('#select_village').clone().attr('id', 'imi_select_village')
		.appendTo('#imi_village_info').wrap('<div class="ig_deck_unitdata_assign deck_wide_select" />');
	}

	$('#select_village, #imi_select_village').change(function() {
		var val = $(this).val();

		$('#select_village').val( val );
		$('#imi_select_village').val( val );
	});
},

//. cardOrderSelecter
cardOrderSelecter: Page.getAction( 'facility', 'set_unit_list', 'cardOrderSelecter' ),

//. changeMode
changeMode: function( release ) {
	var deck_mode = $('#imi_mode').hasClass('imc_deck_mode'),
		open = $('#imi_open').hasClass('imc_is_open');

	$('#imi_card_container').hide();
	$('#imi_card_container1').hide();

	if ( release ) {
		//選択状態解除
		$('#ig_deck_smallcardarea_out').find('.imc_selected').removeClass('imc_selected imc_added');
		$('#imi_bottom_container').find('.ig_deck_smallcardarea').remove();

		Deck.currentUnit.assignList = [];
		Deck.currentUnit.update();
		Deck.updateDeckInfo();
	}

	if ( deck_mode ) {
		$('#imi_village_info').show();
		$('#imi_card_assign').show();

		if ( open ) {
			$('#imi_card_container').show();
		}
	}
	else {
		$('#imi_village_info').hide();
		$('#imi_card_assign').hide();

		if ( open ) {
			$('#imi_card_container1').show();
		}
	}
}

});

//■ /card/status_info
Page.registerAction( 'card', 'status_info', {

//. style
style: '' +
'.imc_update { background-color: #f9dea1 !important; }' +
'',

//. main
main: function() {
	this.layouter();
},

//. layouter
layouter: function() {
	var remain = $('#hidden_remain_pt').val(),
		total = 0,
		$tr, $button;

	//ボタンを追加する
	$button = $('<button id="imi_unlock" style="float: right">未分配行のロックを解除する</button>');
	$button.insertBefore('#status_table');
	$button.click( this.unlock );

	//テーブル内ボタン変更
	$tr = $('#status_table').find('TR:gt(1)');
	$tr.each(function() {
		var $tr = $(this),
			$td = $tr.find('TD');

		$td.eq( 2 ).attr('default', '0');

		// '+5'ボタン
		$td.eq( 3 ).find('INPUT:button').val('全て').each(function() {
			var $this = $(this),
				source = $this.attr('onClick');

			if ( !source ) { return; }

			//後ろ２文字を書き換える
			source = source.slice(0, -2) + remain + ')';

			$this.attr('onClick', source);
		});

		$td.eq( 5 ).each(function() {
			var $this = $(this),
				point = $this.text().toInt();

			$this.attr('default', point);

			//まだ分配されていない場合、ボタンを無効にする
			if ( point == 0 ) {
				$tr.find('INPUT:button').attr('disabled', true);
			}

			total += point;
		});
	});
	$tr.click( this.update );

	if ( total == 0 ) { this.unlock(); }
},

//. unlock
unlock: function() {
	$('#status_table').find('INPUT:button').attr('disabled', false);
	$('#imi_unlock').attr('disabled', true);
	return false;
},

//. update
update: function() {
	$(this).find('TD[default]').each(function() {
		var $this = $(this);

		if ( $this.text() == $this.attr('default') ) {
			$this.removeClass('imc_update');
		}
		else {
			$this.addClass('imc_update');
		}
	});
}

});

//■ /card/trade
Page.registerAction( 'card', 'trade', {

//.. main
main: function() {
	var $tr = $('TABLE.common_table1 > TBODY > TR');

	this.layouter( $tr );

	$('TABLE.common_table1 > TBODY > TR.fs12')
	.live('mouseenter', Util.enter )
	.live('mouseleave', Util.leave );
},

//.. layouter
layouter: function( $tr ) {
	var date = new Date(),
		datestr;

	//8:00:00をセットする
	date.setHours( 8 );
	date.setMinutes( 0 );
	date.setSeconds( 0 );
	//過去時刻の場合、１日進める
	if ( date <= new Date() ) {
		date.setDate( date.getDate() + 1 );
	}

	datestr = date.toFormatDate();

	//名前表示幅拡張
	$tr.eq( 0 ).find('TH')
	.eq( 0 ).css('width', '35px').end()
	.eq( 1 ).css('width', '130px').end()
	.eq( 7 ).css('minWidth', '64px').end()

	$tr.slice( 1 )
	.hover( Util.enter, Util.leave )
	.each(function() {
		var $td = $(this).find('TD'),
			expires = $td.eq( 6 ).text();

		if ( expires == '---' )   { return; } //即決
		if ( expires == datestr ) { return; } //直近

		$td.eq( 6 ).css('backgroundColor', '#ccc');
		$td.eq( 7 ).append('<div>期限チェック</div>');
	});
}

});

//■ /card/trade_bid
Page.registerAction( 'card', 'trade_bid', {

//. style
style: '' +
'INPUT { ime-mode: disabled; }' +
''

});

//■ /card/exhibit_confirm
Page.registerAction( 'card', 'exhibit_confirm', {

//. style
style: '' +
'INPUT { ime-mode: disabled; }' +
'',


//. main
main: function() {
	$('.inputprice').focus();
}

});

//■ /card/exhibit_list
Page.registerAction( 'card', 'exhibit_list', {

//. main
main: function() {
	this.layouter();
	this.transactionFee();
},

//. layouter
layouter: function() {
	var $tr = $('TABLE.common_table1 TR'),
		$th = $tr.eq( 0 ).find('TH');

	//ヘッダ部微調整
	$th.eq( 0 ).css('width', '35px');
	$th.eq( 1 ).css('width', '130px');
	$th.eq( 4 ).append('<div>(受取額)</div>');
	$th.eq( 7 ).append('<div>(受取額)</div>');
},

//. transactionFee
transactionFee: function() {
	var $tr = $('TABLE.common_table1 TR'),
		self = this;

	$tr.slice( 1 ).each(function() {
		var $td = $(this).find('TD');

		self.showPayment( $td.eq( 4 ) );
		self.showPayment( $td.eq( 7 ) );
	});
},

//. showPayment
showPayment: function( $td ) {
	//取消がある場合
	if ( $td.find('A').length > 0 ) { return; }

	var price = $td.text().toInt(),
		fee = Util.getFee( price );

	price = price - fee;

	$td.append('<br/>(' + price.toFormatNumber() + ')');
}

});

//■ /card/deck_card_delete
Page.registerAction( 'card', 'deck_card_delete', {

//. main
main: function() {
	var self = this;

	$.Deferred().resolve()
	.pipe(function() {
		if ( $('UL.pager LI.last A:first').length == 0 ) { return; }

		//２頁目取得
		return $.post( '/card/deck_card_delete.php', { show_num: 100, p: 2 } )
		.pipe(function( html ) {
			var $html = $(html),
				$tr = $html.find('DIV.ig_decksection_innermid TABLE.common_table1 TR').slice( 1 );

			//カード情報
			$html.find('#ig_boxInner > DIV').not('#ig_deckbox, #sidebar').appendTo( '#ig_boxInner' );

			$('DIV.ig_decksection_innermid TABLE.common_table1').append( $tr );
		});
	})
	.pipe(function() {
		self.layouter();
	});
},

//. layouter
layouter: function() {
	//表示件数とページャーを削除
	$('DIV.ig_decksection_innermid > DIV').eq( 0 ).remove();
	$('UL.pager').remove();

	$('TABLE.common_table1').find('TR').slice( 1 )
	.hover( Util.enter, Util.leave )
	.click(function( e ) {
		var tagName = e.target.tagName.toUpperCase();

		if ( tagName == 'INPUT' || tagName == 'A' ) { return; }

		var $input = $(this).find('INPUT'),
			checked = $input.attr('checked');

		$input.attr('checked', !checked);
	});
}

});

//■ /card/card_album
Page.registerAction( 'card', 'card_album', {

//. style
style: '' +
'#ig_deckheadmenubox { top: 0px; }' +
'#ig_deckheadmenubox IMG { position: absolute; clip: rect(5px, 795px, 58px, 0px); }' +
'',

//. main
main: function() {
	this.autoPager();
	this.contextmenu();
},

//. autoPager
autoPager: function() {
	var self = this;

	$.autoPager({
		next: 'UL.pager LI.last A:first',
		container: '.common_box3bottom TABLE.normal',
		loaded: function( html ) {
			var $html = $(html);

			$('.common_box3bottom TABLE.normal > TBODY').append( $html.find('.common_box3bottom TABLE.normal TR') );
			//ポップアップ用
			$('.common_box3bottom').append( $html.find('.common_box3bottom > DIV[id^=cardWindow_]') );
		},
		ended: function() {
			Display.info('全ページ読み込み完了');
		}
	});
},

//. contextmenu
contextmenu: function() {
	$('.ig_deck_smallcardbox').contextMenu(function() {
		var $a = $(this).find('A');

		if ( $a.length == 0 ) { return; }

		var card_no = $a.attr('href').match(/cardWindow_(\d+)/)[ 1 ],
			card = new LargeCard( $('#cardWindow_' + card_no ) ),
			menu = {};

		menu[ card.name ] = $.contextMenu.title;
		menu[ '取引で「' + card.name + '」を検索' ] = function() { Util.searchTradeCardNo( card.cardNo ); };
		card.skillList.forEach(function( skill ) {
				menu[ '取引で「' + skill.name + '」を検索' ] = function() { Util.searchTradeSkill( skill.name ); };
		});

		return menu;
	}, true);
}

});

//■ /map
Page.registerAction( 'map', {

//. style
style: '' +
/* 地図 */
'#box { min-height: 855px; }' +
'#ig_mapbox_container { left: 15px; top: 130px; }' +
'#ig_mapbox_container #ig_cur01   { left: 700px; top: 210px; }' +
'#ig_mapbox_container #ig_cur01_w { left: 700px; top: 190px; }' +
'#ig_mapbox_container #ig_cur02   { left: 700px; top: 235px; }' +
'#ig_mapbox_container #ig_cur02_w { left: 700px; top: 235px; }' +
'#ig_mapbox_container #ig_cur03   { left: 650px; top: 235px; }' +
'#ig_mapbox_container #ig_cur03_w { left: 620px; top: 235px; }' +
'#ig_mapbox_container #ig_cur04   { left: 650px; top: 210px; }' +
'#ig_mapbox_container #ig_cur04_w { left: 620px; top: 190px; }' +
'.ig_mappanel_maindataarea { left: 5px; top: 1px; }' +
'.ig_mappanel_dataarea { background-color: #191919; border: solid 1px #AE922E; background-position: -80px -1px; }' +
'.ig_mappanel_dataarea TABLE { background-color: #191919; margin-left: -8px; padding-left: 8px; }' +
'.ig_map_ownertitle,' +
'.ig_map_grouptitle { width: 40px; }' +
'.ig_map_ownername,' +
'.ig_map_groupname { width: 140px; }' +
'.ig_map_place1,' +
'.ig_map_population { width: 135px; }' +

'#ig_map_movepanel { left: 7px; top: 327px; width: 200px; height: 53px; border: solid 2px #888; background-position: -10px -14px; }' +
'#ig_map_movepanel FORM { top: 0px; }' +
'#ig_map_movepanel UL { top: 25px; left: 460px; width: 158px; height: 26px; background-color: #f1f0dc; border: solid 2px #888; }' +
'#ig_map_movepanel UL LI { background-color: transparent; }' +
'.ig_map_movepanel_inputarea { top: 27px; left: 11px; }' +
'.ig_map_movepanel_btnarea { top: 20px; }' +
'.ig_map_movepanel_btnarea INPUT ~ INPUT { display: none; }' +

'#village_name { width: 400px; }' +
'#mapSubmenu { z-index: 300; }' +

/* 表示国セレクタ */
'#imi_country_selecter { position: absolute; top: 12px; left: 390px; height: 20px; color: #fff; background: none; z-index: 201; }' +
'#imi_country_selecter SELECT { margin: 0px 5px; }' +

/* 部隊状況 */
'#imi_unitstatus { position: absolute; top: 110px; left: 5px; width: 250px; font-size: 11px; height: 80px; background-color: #F1F0DC; z-index: 2; }' +
'#imi_unitstatus TABLE { width: 100%; height: 100%; }' +
'#imi_unitstatus TR { height: 16px; }' +
'#imi_unitstatus TD { padding: 0px; }' +
'#imi_unitstatus DIV { padding: 0px 2px; text-align: left; white-space: nowrap; overflow: hidden; }' +
'#imi_unitstatus A { color: #000; }' +
'#imi_unitstatus A:hover { background-color: #f9dea1; }' +
'#imi_unitstatus .imc_countdown_display { font-family: "Verdana"; font-size: 10px; }' +
'#imi_unitstatus .imc_coord { font-weight: normal; }' +
/* 部隊行動 */
'#imi_unitstatus .imc_attack  { background-color: #f66; }' +
'#imi_unitstatus .imc_camp    { background-color: #c33; color: #fff; }' +
'#imi_unitstatus .imc_meeting { background-color: #6cf; }' +
'#imi_unitstatus .imc_backup  { background-color: #09c; color: #fff; }' +
'#imi_unitstatus .imc_return  { background-color: #ddd; }' +
'#imi_unitstatus .imc_dungeon { background-color: #f96; }' +
'#imi_unitstatus .imc_develop { background-color: #390; color: #fff; }' +
'#imi_unitstatus .imc_move    { background-color: #93c; color: #fff; }' +
'#imi_unitstatus .imc_wait    { background-color: #9c3; }' +
'#imi_unitstatus .imc_backup_wait { background-color: #396; color: #fff; }' +

/* 座標ペーストエリア */
'#imi_coord_container { position: absolute; top: 327px; left: 9px; z-index: 106; }' +
'#imi_coord_container LABEL { position: absolute; width: 90px; height: 20px; font-size: 12px; padding: 6px 0px 0px 3px; background-color: #F7F7D6; font-weight: bold; text-shadow: 1px 0px 3px #ddb, -1px 0px 3px #ddb, 0px 1px 3px #ddb, 0px -1px 3px #ddb; }' +
'#imi_coord_move { position: absolute; width: 80px; height: 17px; top: 2px; left: 82px; border: solid 1px #ccc; }' +

/* 情報表示エリア */
'#imi_tab_container { position: absolute; top: 392px; left: 7px; height: 16px; z-index: 201; }' +
'#imi_tab_container LI { float: left; border: solid 1px #888; background-color: #f1f0dc; color: #666; font-size: 12px; line-height: 16px; text-align: center; padding: 0px 15px; margin-top: 1px; cursor: pointer; z-index: 1001; }' +
'#imi_tab_container LI.imc_selected { color: #000; font-weight: bold; border-width: 2px; border-bottom-color: #f1f0dc; margin-top: 0px; }' +
'#imi_container { position: absolute; font-size: 11px; z-index: 200 }' +
'#imi_container > DIV { position: absolute; top: 410px; left: 5px; width: 770px; height: 425px; border: solid 2px #888; background-color: #f1f0dc; padding: 3px; overflow: auto; }' +
'#imi_container A { color: #060; }' +
'#imi_container INPUT { margin-right: 5px; }' +
'#imi_container LABEL { margin-right: 10px; cursor: pointer; }' +

/* 拠点情報 */
'#imi_base_conditions { margin-bottom: 10px; }' +
'#imi_base_conditions SELECT { position: relative; top: -1px; margin: -2px; }' +

/* 座標情報 */
'.imc_fort TD { width: 50px; }' +
'.imc_fort2 TD { width: 42px; }' +

/* 敵襲情報 */
'#imi_tab_container LI.imc_enemy { color: #f30; }' +
'#imi_raid_list TR { cursor: pointer; }' +
'.imc_new_enemy { background-color: #fdc; }' +
'#imi_raid_list .imc_countdown_alert TD:last-child { background-color: #c03; }' +
'#imi_raid_list .imc_countdown_alert .imc_countdown_display { color: #fff; }' +

/* 新合戦耐久度 */
'.imc_gage { border-width: 2px; margin: 0px auto; }' +
'.imc_gage TD { padding: 0px; width: 5px; height: 7px; font-size: 10px; background-color: #fe0; }' +
'.imc_gage TD.imc_lose { background-color: #b00; }' +

/* 影武者 */
'#kagemusha_list { position: static; width: 755px; }' +
'#kagemusha_list .frame_top { width: 740px; height: 25px; margin: 10px 0px 0px 15px; background-position: -15px -8px; }' +
'#kagemusha_list .frame_spacer { width: auto; background: none; }' +
'#kagemusha_list .frame_bottom { width: auto; background: none; }' +
'#kagemusha_list .imc_current * { color: #000 !important; }' +

/* 合戦報告書・周辺の敵襲 */
'TABLE.ig_battle_table { width: 650px; }' +
'.ig_battle_table TD { height: 18px; padding: 2px 8px; line-height: 18px; }' +
'.ig_battle_table A { line-height: 18px; }' +
'.ig_battle_report_icon1,' +
'.ig_battle_report_icon2 { float: left; width: 18px; height: 18px; }' +
'.ig_battle_report_text { float: left; width: 440px; height: 18px; padding: 0px 5px; line-height: 18px; text-align: left; }' +

( ( Env.chapter >= 5 ) ?
'#imi_map { position: relative; top: 4px; left: 625px; display: inline-block; }' +
'#imi_mapcontainer { border-width: 5px; }' :
'#imi_map { position: relative; top: 4px; left: 606px; display: inline-block; }' +
'#imi_mapcontainer { border-width: 3px; }' ) +


/* 部隊編成 */
'#imi_card_container { padding: 3px 0px 2px 6px; border: solid 1px #b8860b; width: 550px; height: 149px; background-color: #000; float: left; }' +
'#imi_deck_info { margin-left: 10px; padding: 2px; width: 280px; height: 149px; float: left; }' +
'#imi_deck_info LI { height: 18px; line-height: 18px; padding-top: 3px; border-bottom: solid 1px #cc9; font-size: 12px; }' +
'#imi_deck_info LI LABEL { width: 40px; height: 18px; line-height: 18px; background-color: #cc9; padding-left: 5px; display: inline-block; }' +
'#imi_deck_info LI.imc_enemy { border-color: #f66; }' +
'#imi_deck_info LI.imc_enemy LABEL { background-color: #f66; }' +
'#imi_deck_info .imc_countdown_display { padding-left: 5px; }' +
'.imc_village { margin-left: 5px; }' +
'.imc_info1 { width: 30px; text-align: right; font-weight: bold; display: inline-block; margin-right: 5px; }' +
'.imc_info1_free { width: 30px; text-align: right; display: inline-block; margin-right: 20px; }' +
'.imc_info2 { width: 20px; text-align: right; font-weight: bold; display: inline-block; margin-right: 5px; }' +
'.imc_info2_free { width: 20px; text-align: right; display: inline-block; }' +
'.imc_info3,' +
'.imc_info4,' +
'.imc_info5 { width: 71px; text-align: right; display: inline-block; margin-right: 20px; }' +
'.imc_info6,' +
'.imc_info7 { width: 85px; text-align: right; display: inline-block; }' +
'.imc_info8 { width: 91px; border-style: none; }' +
'.imc_info9 { padding-left: 5px; }' +
/* カード */
'.ig_deck_smallcardarea { float: left; width: 116px; height: 136px; padding: 5px 7px; margin: 0px 5px 8px 0px; border: solid 1px #666; background: -moz-linear-gradient(top left, #444, #000); }' +
'.ig_deck_smallcardarea.imc_disabled { opacity:0.7; }' +
'.ig_deck_smallcardarea TABLE { position: relative; width: 100%; margin-bottom: 5px; border-left: 1px dotted #fff; border-top: 1px dotted #fff; border-collapse: separate; background-color: #333; font-size: 10px; z-index: 4; }' +
'.ig_deck_smallcardarea TR { height: 15px; }' +
'.ig_deck_smallcardarea TH { padding: 2px; border-right: 1px dotted #fff; border-bottom: 1px dotted #fff; color: #ff0; }' +
'.ig_deck_smallcardarea TD { padding: 2px; border-right: 1px dotted #fff; border-bottom: 1px dotted #fff; color: #fff; }' +
'.imc_card_header { position: relative; color: #fff; }' +
'.imc_infotype_2 .imc_status1 { display: none; }' +
'.imc_infotype_1 .imc_status2 { display: none; }' +
'.imc_disabled .imc_card_header { color: #999; }' +
'.imc_cardname { font-weight: bold; }' +
'.imc_rarity { position: absolute; left: 88px; font-size: 10px; line-height: 16px; }' +
'.imc_cost { position: absolute; left: 100px; font-size: 11px; line-height: 17px; letter-spacing: -1px; }' +
'.imc_rank { color: red; font-weight: bold; font-size: 11px; }' +
'.imc_lv { font-size: 11px; letter-spacing: -1px; }' +
'.imc_card_status TH { width: 45px; }' +
'.imc_card_status .emphasis { background-color: #808080; }' +
'.imc_card_status .imc_solmax { background-color: #642; }' +
'.imc_card_status .imc_power { background-color: #246; }' +
'.imc_card_status .imc_power TD { text-align: right; padding-right: 5px; }' +
'.imc_card_param { }' +
'.imc_card_skill { }' +
'.imc_card_skill TH { width: 20px; }' +
/* HP・討伐ゲージ用バー */
'.imc_bar_title { color: white; font-size: 10px; }' +
'.imc_bar_battle_gage { width: 110px; height: 4px; border: solid 1px #c90; border-radius: 2px; background: -moz-linear-gradient(left, #cc0, #c60); margin-bottom: 1px; }' +
'.imc_bar_hp { width: 110px; height: 4px; border: solid 1px #696; border-radius: 2px; background: -moz-linear-gradient(left, #a60, #3a0); }' +
'.imc_bar_inner { background-color: #000; float: right; height: 100%; display: inline-block; }' +
/* 全部隊登録 */
'#imi_unitnum TD { width: 40px; cursor: pointer; }' +
'#imi_unitnum .imc_selected { background-color: #f9dea1; }' +

/* フィルタ */
'.imc_command_selecter LI .imc_pulldown { position: absolute; margin: 1px -1px; padding: 2px; background-color: #000; border: solid 1px #fff; z-index: 2000; text-align: left; display: none; }' +
'.imc_command_selecter LI:hover .imc_pulldown { display: block; }' +
'.imc_command_selecter LI A.imc_pulldown_item { padding: 3px 0px; text-indent: 0px; width: 65px !important; height: 20px; line-height: 20px; text-align: center; color: #fff; background: #000 none; display: inline-block; }' +
'.imc_command_selecter LI A:hover { color: #fff; background-color: #666; }' +
'#ig_deck_smallcardarea_out .imc_selected { padding: 4px 6px; border: solid 2px #f80 !important; background: -moz-linear-gradient(top left, #654, #000) !important; }' +

'#imi_new_deck { float: right; margin-right: 16px; }' +
'#imi_new_deck LI { float: right; min-width: 44px; height: 20px; line-height: 20px; text-align: center; padding: 0px 8px; border: solid 1px #666; color: #666; background-color: #000; margin-left: 8px; cursor: pointer; }' +
'#imi_new_deck LI:hover { background-color: #666; border-color: #fff; color: #fff; }' +
'#imi_new_deck #imi_info_change { background-color: #666; border-color: #fff; color: #fff; }' +
'#imi_new_deck #imi_info_change.imc_infotype_1:after { content: "表示１" }' +
'#imi_new_deck #imi_info_change.imc_infotype_2:after { content: "表示２" }' +

/* 兵種変更 */
'#imi_unitedit { margin: auto; }' +
'#imi_unitedit TH:first-child { width: 60px; }' +
'#imi_unitedit TD { width: 40px; cursor: pointer; }' +
'#imi_unitedit TD.imc_disabled { background-color: #ccc; cursor: auto; }' +
'#imi_unitedit .imc_selected { background-color: #f9dea1; }' +

/* style調整 */
'#material { line-height: 14px; }' +
'#material IMG { margin-top: -3px; }' +
'#map_effect_atc { line-height: 14px; }' +
'#map_effect_atc IMG { vertical-align: middle; margin-top: -3px; padding-right: 2px; }' +
'.ig_mappanel_maindataarea { height: auto !important; }' +
'.ig_mappanel_dataarea{ height: auto !important; width: 600px; }' +
'.ig_mappanel_dataarea > TABLE { width: 616px; }' +
'P.areaDir { top: 202px; left: 536px; }' +
'',

//. main
main: function() {
	Map.init();
	this.layouter();
	this.layouterMapInfo();
	this.layouterCoord();
	this.layouterSituation();
	this.layouterWarReport();
	this.layouterRanking();
	this.layouterScore();
	this.layouterUnitStatus();
	this.countrySelecter();
	if ( $('#kagemusha_list').length > 0 ) {
		this.layouterKagemusha();
	}
	Map.setup();
	Util.keyBindMap();
},

//. layouter
layouter: function() {
	var html;

	//情報表示欄を削除
	$('#act_battle_data, #map_youpoint, #map_statusbox, #map_textarea, #map_view_text').remove();
	$('.ig_mappanel_dataarea > IMG').remove();
	//新合戦場ラベル削除
	$('#ig_new_map_country').remove();

	$('#map_situation, #map_navi, .ig_map_panel_img').hide();

	//移動ボタン
	$('#ig_cur01, #ig_cur02, #ig_cur03, #ig_cur04, #ig_cur01_w, #ig_cur02_w, #ig_cur03_w, #ig_cur04_w')
	.live('click', function() {
		var href = $(this).attr('href'),
			match = href.match(/x=(-?\d+)&y=(-?\d+)&c=(\d+)/);

		if ( match ) {
			Map.move( match[1], match[2], match[3] );
		}

		return false;
	});

	//座標貼り付けエリア
	html = '<div id="imi_coord_container">' +
		'<label>座標貼り付け：</label>' +
		'<input id="imi_coord_move" />' +
	'</div>';

	$( html ).appendTo('#ig_mapbox')
	.find('#imi_coord_move')
	.focus(function() { $(this).val(''); })
	.change(function() {
		var text = $(this).val(),
			match = text.match(/(-?\d{1,3})[^\d-]+(-?\d{1,3})/),
			$inputarea = $('.ig_map_movepanel_inputarea');

		if ( match ) {
			$inputarea.find('INPUT[name="x"]').val( match[ 1 ] );
			$inputarea.find('INPUT[name="y"]').val( match[ 2 ] );
		}
		else {
			$inputarea.find('INPUT').val('');
		}
	});

	$('.ig_map_movepanel_btnarea INPUT').first()
	.attr('onclick', 'return false;')
	.click(function() {
		var $inputarea = $('.ig_map_movepanel_inputarea'),
			x = $inputarea.find('INPUT[name="x"]').val().trim(),
			y = $inputarea.find('INPUT[name="y"]').val().trim();

		if ( x == '' || y == '' ) { return; }

		Map.move( x, y );

		$('#imi_coord_move').val('');
		$inputarea.find('INPUT').val('');
	});

	//情報表示エリア調整
	$('#user_name, #alliance_name').width( 155 );

	//NPC空き地必要攻撃力表示エリア
	html = '<tr>' +
		'<th style="color: #ff0">攻撃力</th>' +
		'<td colspan="7"><span id="imi_npc_attack"/></td>' +
	'</tr>';

	$( html ).appendTo('DIV.ig_mappanel_dataarea TABLE');

	//表示欄追加
	html = '<div id="imi_container">' +
		'<div id="imi_base" />' +
		'<div id="imi_coord" style="display: none;" />' +
		'<div id="imi_situation" style="display: none;" />' +
		'<div id="imi_warlist" style="display: none;" />' +
		'<div id="imi_ranking" style="display: none;" />' +
		'<div id="imi_score" style="display: none;" />' +
	'</div>';

	$( html ).appendTo('#ig_mapbox');

	//タブ
	html = '<ul id="imi_tab_container">' +
		'<li target="imi_base" class="imc_selected">拠点情報</li>' +
		'<li target="imi_coord">座標情報</li>' +
		'<li target="imi_situation">敵襲状況</li>' +
		'<li target="imi_warlist">合戦報告書</li>' +
		'<li target="imi_ranking">格付</li>' +
		'<li target="imi_score">一戦</li>' +
	'</ul>';

	$( html ).appendTo('#ig_mapbox')
	.on( 'click', 'LI', function() {
		var $this = $(this);

		$this.parent().find('LI').removeClass('imc_selected');
		$this.addClass('imc_selected');
		$('#imi_container').children('DIV').hide().filter('#' + $this.attr('target')).show();
	});

	//小マップ
	$('<div id="imi_map" />').appendTo('#ig_mapbox')
	Map.showCountryMap( Map.info.country );
},

//. layouterMapInfo
layouterMapInfo: function() {
	var settings = MetaStorage('SETTINGS').get('mapinfo') || { type: '|城||砦|村||出城|', discriminant: '', alliance: '', rank: 0 },
		type = settings.type,
		html;

	//拠点情報
	html = '' +
	'<table id="imi_base_conditions" class="imc_table" style="float: left; margin-right: 20px;">' +
	'<tr/>' +
		'<th>種別</th>' +
		'<td style="text-align: left">' +
			'<label><input type="checkbox" name="imn_type" value="|城|" />本領</label>' +
			'<label><input type="checkbox" name="imn_type" value="|砦|村|" />所領</label>' +
			'<label><input type="checkbox" name="imn_type" value="|出城|" />出城</label>' +
			'<label><input type="checkbox" name="imn_type" value="|陣|" />陣</label>' +
			'<label><input type="checkbox" name="imn_type" value="|陥落|" />陥落</label>' +
			'<label><input type="checkbox" name="imn_type" value="|領地|" />領地</label>' +
			'<label><input type="checkbox" name="imn_type" value="|空き地|" />空き地</label>' +
			'<select name="imn_rank">' +
				'<option value="0">全て</option>' +
				'<option value="1">★１以下</option>' +
				'<option value="2">★２以下</option>' +
				'<option value="3">★３以下</option>' +
				'<option value="4">★４以下</option>' +
				'<option value="5">★５以下</option>' +
				'<option value="6">★６以上</option>' +
				'<option value="7">★７以上</option>' +
				'<option value="8">★８以上</option>' +
			'</select>' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<th>識別</th>' +
		'<td style="text-align: left">' +
			'<label><input type="radio" name="imn_discriminant" value="" />全て</label>' +
			'<label><input type="radio" name="imn_discriminant" value="|自分|" />自分</label>' +
			'<label><input type="radio" name="imn_discriminant" value="|自分|同盟|" />同盟</label>' +
			'<label><input type="radio" name="imn_discriminant" value="|味方|" />味方</label>' +
			'<label><input type="radio" name="imn_discriminant" value="|敵|" />敵</label>' +
			'<label><input type="radio" name="imn_discriminant" value="|-|" />無し</label>' +
		'</td>' +
	'</tr>' +
	'<tr/>' +
		'<th>同盟名</th>' +
		'<td style="text-align: left">' +
			'<input type="text" name="imn_alliance" value="" />' +
		'</td>' +
	'</tr>' +
	'</table>' +
	'<table class="imc_table">' +
	'<tr><th>本領陥落データ</th><td><button id="imi_cache_delete">削除</button></td></tr>' +
	'</table>' +
	'<table class="imc_table" style="margin-bottom: 20px; clear: both;">' +
	'<thead><tr>' +
		'<th style="width: 120px">同盟名</th>' +
		'<th style="width: 120px">城主名</th>' +
		'<th style="width: 130px">城名</th>' +
		'<th style="width: 35px">種別</th>' +
		'<th style="width: 25px">規模</th>' +
		'<th style="width: 30px">識別</th>' +
		'<th style="width: 30px">人口</th>' +
		'<th style="width: 56px">座標</th>' +
		'<th style="width: 30px">距離</th>' +
	'</tr></thead>' +
	'<tbody id="imi_base_list"></tbody>' +
	'</table>' +
	'';

	$( html ).appendTo('#imi_base')
	.change( Map.analyzeReport )
	.find('INPUT[name="imn_type"]').each(function() {
		var $this = $(this);

		if ( type.indexOf( $this.val() ) != -1 ) {
			$this.attr('checked', true);
		}
	}).end()
	.find('SELECT[name="imn_rank"]').val( settings.rank ).end()
	.find('INPUT[value="' + settings.discriminant + '"]').attr('checked', true).end()
	.find('INPUT[name="imn_alliance"]').val( settings.alliance ).end();

	$('#imi_cache_delete').click(function() {
		if ( !confirm( '本領陥落データを全て削除します。\nよろしいですか？') ) { return; }

		MetaStorage('USER_FALL').clear();
	});
},

//. layouterCoord
layouterCoord: function() {
	var html;

	//登録座標リスト
	html = '<div style="float: left; margin-right: 20px;">' +
	'<table class="imc_table">' +
	'<thead><tr>' +
		'<th width="120">城主名</th>' +
		'<th width="130">城名</th>' +
		'<th width="56">座標</th>' +
		'<th width="35">種別</th>' +
	'</tr></thead>' +
	'<tbody id="imi_coord_list"></tbody>' +
	'</table>' +
	'<button class="imc_coord_delete" style="margin-top: 10px;">全削除</button>' +
	'</div>';

	$( html ).appendTo('#imi_coord')
	.on('click', '.imc_coord_delete', function() {
		var country = Map.info.country,
			name = Data.countries[ country ];

		if ( !name ) {
			name = { 20: '新合戦場１', 21: '新合戦場２' }[ country ];
		}

		if ( !confirm( name + 'の登録座標を全て削除します。\nよろしいですか？') ) { return; }

		MetaStorage('COORD.' + country).clear();
		$('#imi_coord_list').empty();
		Map.showCoord( country );
	});

	//砦一覧
	if ( Map.info.isBattleMap ) {
		this.fortressLink2();
	}
	else {
		this.fortressLink();
	}
},

//. layouterSituation
layouterSituation: function() {
	var settings = MetaStorage('SETTINGS').get('situation') || {},
		arrival = settings.arrival || 0,
		html;

	html = '' +
	'<table id="imi_raid_conditions" class="imc_table">' +
	'<tr>' +
		'<th>着弾まで</th>' +
		'<td>' +
			'<label><input type="radio" name="imn_arrival" value="10" />１０分以内</label>' +
			'<label><input type="radio" name="imn_arrival" value="20" />２０分以内</label>' +
			'<label><input type="radio" name="imn_arrival" value="30" />３０分以内</label>' +
			'<label><input type="radio" name="imn_arrival" value="0" />全て</label>' +
		'</td>' +
	'</tr>' +
	'</table>' +
	'<br/>' +
	'<table class="imc_table">' +
	'<thead><tr>' +
		'<th width="130">部隊</th>' +
		'<th width="140">発射地点</th>' +
		'<th>距離</th>' +
		'<th width="30">種別</th>' +
		'<th width="140">着弾地点</th>' +
		'<th width="80">着弾時間</th>' +
		'<th width="50">着弾まで</th>' +
	'</tr></thead>' +
	'<tbody id="imi_raid_list"></tbody>' +
	'</table>' +
	'<hr style="display: block; margin: 10px 0px; border-color: #ccc"/>' +
	'<table class="ig_battle_table imc_table">' +
	'<thead><tr>' +
		'<th width="30">拠点</th>' +
		'<th>城主名</th>' +
		'<th>同盟</th>' +
		'<th>地名</th>' +
		'<th width="50">部隊数</th>' +
		'<th width="50">敵襲</th>' +
	'</tr></thead>' +
	'<tbody id="imi_situation_list"></tbody>' +
	'</table>' +
	'';

	$( html ).appendTo('#imi_situation');

	$('#imi_raid_conditions').on('change', function() {
		var $this = $(this),
			arrival = $this.find('INPUT[name="imn_arrival"]:checked').val().toInt(),
			type = '';

		$this.find('input[name="imn_base_type"]').filter(':checked').each(function() { type += $(this).val(); });

		MetaStorage('SETTINGS').set('situation', { arrival: arrival, type: type });

		$('#imi_raid_list').trigger('update');
	})
	.find('INPUT[value="' + arrival + '"]').attr('checked', true).end();

	$('#imi_raid_list').on('update', function() {
		var $this = $(this),
			$li = $('#imi_tab_container LI[target=imi_situation]'),
			settings = MetaStorage('SETTINGS').get('situation') || {},
			remain = settings.arrival || 0,
			enemy = MetaStorage('UNIT_STATUS').get('敵襲') || [],
			now, time, list, list2;

		//保存形式変更の為
		if ( !$.isArray( enemy ) ) { enemy = []; }

		now  = Util.getServerTime();
		if ( remain == 0 ) { remain = ( 2 * 24 * 60 ); }
		remain *= 60;
		time = now + remain;

		//着弾時間が過去のものを除く
		enemy = enemy.filter(function( value ) {
			return !( value.arrival < now );
		});

		MetaStorage('UNIT_STATUS').set('敵襲', enemy);

		list = enemy.filter(function( value ) {
			if ( value.arrival > time ) { return false; }
			return true;
		}).sort(function( a, b ) {
			return ( a.arrival > b.arrival );
		});

		$this.empty();
		$li.toggleClass('imc_enemy', ( list.length > 0 ) );
		$li.text('敵襲状況(' + list.length + ')' )

		for ( var i = 0, len = list.length; i < len; i++ ) {
			let { user, sbase, sx, sy, sc, ebase, ex, ey, ec, type, arrival, newenemy } = list[ i ],
				html, dist, $tr;

			dist = Util.getDistance({ x: sx, y: sy }, { x: ex, y: ey });
			newenemy = newenemy ? 'imc_new_enemy': '';

			html = '<tr class="imc_countdown ' + newenemy + '">' +
				'<td>「' + user + '」部隊</td>' +
				'<td>' + sbase + '</td>' +
				'<td>⇒<br/>' + dist.toRound( 2 ) + '</td>' +
				'<td>' + type + '</td>' +
				'<td>' + ebase + '</td>' +
				'<td>' + arrival.toFormatDate() + '</td>' +
				'<td><span class="imc_countdown_display" /></td>' +
			'</tr>';

			$tr = $( html );
			$tr.data({
				endtime: arrival, alert: 120, finishevent: 'raidlistupdate',
				user: user, sx: sx, sy: sy, sc: sc, ebase: ebase, ex: ex, ey: ey, ec: ec
			});

			$this.append( $tr );
		}

		list = enemy.filter(function( value ) {
			return ( value.arrival > time );
		});

		for ( var i = 0, len = list.length; i < len; i++ ) {
			let { user, sbase, sx, sy, ebase, ex, ey, arrival, newenemy } = list[ i ],
				html, dist, $tr;

			dist = Util.getDistance({ x: sx, y: sy }, { x: ex, y: ey });
			newenemy = newenemy ? 'imc_new_enemy': '';

			html = '<tr class="imc_countdown" style="display: none"/>';

			$tr = $( html );
			$tr.data({ endtime: arrival, alert: remain, alertevent: 'raidlistupdate2' });

			$this.append( $tr );
		}

		Util.countDown();
		Map.showMark();
	})
	.on('mouseenter', 'TR', Util.enter)
	.on('mouseleave', 'TR', Util.leave)
	.trigger('update');

	$('#imi_raid_list TR').contextMenu(function() {
		var title = $(this).find('TD').eq( 4 ).text(),
			menu = {};

		menu[ title ] = $.contextMenu.title;
		menu['ここを中心に表示'] = function() {
			var { ex, ey, ec } = $(this).data();
			Map.move( ex, ey, ec );
		};
		menu['この拠点'] = {
			'部隊作成【第一組】': function() { createUnit.call( this, 1 ); },
			'部隊作成【第二組】': function() { createUnit.call( this, 2 ); },
			'部隊作成【第三組】': function() { createUnit.call( this, 3 ); },
			'部隊作成【第四組】': function() { createUnit.call( this, 4 ); },
			'部隊作成【全武将】': function() { createUnit.call( this, 0 ); },
			'セパレーター': $.contextMenu.separator,
			'拠点選択': function() {
				var { ebase } = $(this).data(),
					village = Util.getVillageByName( ebase );

				if ( village ) {
					location.href = Util.getVillageChangeUrl( village.id, '/map.php' );
				}
				else{
					Display.alert( '拠点は見つかりませんでした。' );
				}
			}
		};

		menu['セパレーター1'] = $.contextMenu.separator;
		menu['発射地点を中心に表示'] = function() {
			var { sx, sy, sc } = $(this).data();
			Map.move( sx, sy, sc );
		};
		menu['合戦報告書【城主】'] = function() {
			var { user } = $(this).data();
			Map.contextmenu.warList( user );
		};
		menu['格付'] = function() {
			var { user } = $(this).data();
			Map.contextmenu.ranking( user );
		};
		menu['一戦撃破・防衛'] = function() {
			var { user } = $(this).data();
			Map.contextmenu.score( user );
		};

		return menu;
	}, true);

	function createUnit( brigade ) {
		var { ebase } = $(this).data(),
			village = Util.getVillageByName( ebase );

		brigade |= 0;

		if ( village ) {
			Deck.dialog( village, brigade );
		}
		else{
			Display.alert( '拠点は見つかりませんでした。' );
		}
	}
},

//. layouterWarReport
layouterWarReport: function() {
	var html;

	html = '' +
	'<table class="ig_battle_table imc_table">' +
	'<thead><tr>' +
		'<th width="30">攻守</th>' +
		'<th>ログ</th>' +
		'<th width="80">時間</th>' +
	'</tr></thead>' +
	'<tbody id="imi_warreport_list"></tbody>' +
	'</table>' +
	'';

	$( html ).appendTo('#imi_warlist');
},

//. layouterRanking
layouterRanking: function() {
	var html;

	html = '' +
	'<table class="imc_table">' +
	'<thead><tr>' +
		'<th width="65">国</th>' +
		'<th width="30">順位</th>' +
		'<th width="130">城主名</th>' +
		'<th width="130">同盟</th>' +
		'<th width="45">戦功</th>' +
		'<th width="45">攻撃</th>' +
		'<th width="45">防御</th>' +
		'<th width="40">人口</th>' +
		'<th width="45">総合</th>' +
	'</tr></thead>' +
	'<tbody id="imi_ranking_list"></tbody>' +
	'</table>' +
	'';

	$( html ).appendTo('#imi_ranking');
},

//. layouterScore
layouterScore: function() {
	var html;

	html = '' +
	'<table class="imc_table">' +
	'<thead><tr>' +
		'<th width="65">国</th>' +
		'<th width="30">順位</th>' +
		'<th width="130">城主名</th>' +
		'<th width="130">同盟</th>' +
		'<th width="100">一戦撃破</th>' +
		'<th width="100">一戦防衛</th>' +
	'</tr></thead>' +
	'<tbody id="imi_score_list"></tbody>' +
	'</table>' +
	'';

	$( html ).appendTo('#imi_score');
},

//. layouterUnitStatus
layouterUnitStatus: function() {
	var html = '<div id="imi_unitstatus"><table class="imc_table">' + '<tr><td/></tr>'.repeat( 5 ) + '</table></div>';

	$( html ).appendTo('#ig_mapbox');

	$('#imi_unitstatus').on('update', function() {
		var $this = $(this),
			$table = $('<table class="imc_table"/>'),
			date = Util.getServerTime(),
			list = MetaStorage('UNIT_STATUS').get('部隊') || [],
			classlist = {
				'攻撃': 'imc_attack', '陣張': 'imc_camp', '合流': 'imc_meeting',
				'加勢': 'imc_backup', '帰還': 'imc_return', '探索': 'imc_dungeon',
				'開拓': 'imc_develop', '国移': 'imc_move', '待機': 'imc_wait', '加待': 'imc_backup_wait'
			},
			$tr, classname, html;

		for ( var i = 0, len = list.length; i < len; i++ ) {
			let { name, mode, target, ex, ey, ec, arrival } = list[ i ];
			classname = classlist[ mode ] || '';

			if ( mode == '探索' ) {
				html = target;
			}
			else {
				html = '<span class="imc_coord" x="' + ex + '" y="' + ey + '" c="' + ec + '">' +
					target + ' (' + ex + ',' + ey + ')</span>';
			}

			html = '' +
				'<td><div style="width: 67px;"><a href="/card/deck.php?ano=' + i + '">' + name + '</a></div></td>' +
				'<td><div style="width: 86px;">' + html + '</div></td>' +
				'<td style="width: 33px;" class="' + classname + '">' + mode + '</td>' +
				'<td style="width: 55px;"><span class="imc_countdown_display" /></td>';

			$tr = $('<tr/>').append( html );

			if ( mode == '待機' || mode == '加待' ) {
				//待機中、カウントダウンしない
			}
			else if ( arrival <= date ) {
				//着弾時間が過去の場合、「--:--:--」の表示、10秒後(7 + delay3)に再取得
				$tr.addClass('imc_countdown');
				$tr.data({ endtime: date + 7, finishevent: 'actionrefresh' });
				$tr.find('.imc_countdown_display').removeAttr('class').text('--:--:--');
			}
			else {
				//行動中
				$tr.addClass('imc_countdown');
				$tr.data({ endtime: arrival, alert: 60, finishevent: 'actionfinish', message: '・[' + name + ']部隊' });
			}

			$table.append( $tr );
		}

		for ( var i = list.length; i < 5; i++ ) {
			html = '' +
			'<td><div style="width: 67px;"><a href="/card/deck.php?ano=' + i + '">[部隊作成]</a></div></td>' +
			'<td><div style="width: 86px;"></div></td>' +
			'<td style="width: 33px;"></td>' +
			'<td style="width: 55px;"></td>';

			$tr = $('<tr/>').append( html );
			$table.append( $tr );
		}

		$this.empty().append( $table );
		Util.countDown();
		Map.showMark();
	});

	Util.getUnitStatus();
},

//. layouterKagemusha
layouterKagemusha: function() {
	var $div = $('<div id="imi_kagemusha" style="display: none;"></div>');

	$div.append( $('#kagemusha_list') )
	.on( 'click', '.tr_gradient', function() {
		var { x, y, c } = $(this).data();

		Map.move( x, y, c );
		return false;
	});

	$div.find('.tr_gradient')
	.each(function() {
		var $this = $(this),
			match = $this.find('.zahyou').attr('href').match(/x=(-?\d+)&y=(-?\d+)&c=(\d+)/);

		if ( !match ) { return; }

		$this.data({ x: match[ 1 ].toInt(), y: match[ 2 ].toInt(), c: match[ 3 ].toInt() });
	})
	.hover(
		function() {
			var { x, y } = $(this).data();

			CounteryMap.showPointer( x, y );
			Util.enter.call( this );
		},
		function() {
			CounteryMap.showPointer();
			Util.leave.call( this );
		}
	);

	$('#imi_tab_container').append('<li target="imi_kagemusha">影武者</li>');
	$('#imi_container').append( $div );
},

//. countrySelecter
countrySelecter: function() {
	var country = Map.info.country,
		countries = Data.countries,
		$selecter = $('<select />');

	$selecter.change(function() {
		var mapinfo = Map.info,
			country = $(this).find('OPTION:selected').attr('value');

		location.href = '/map.php?x=' + mapinfo.x + '&y=' + mapinfo.y + '&c=' + country;
	});

	countries.forEach(function( value, idx ) {
		if ( idx == 0 ) { return; }

		$('<option>■ ' + value + ' ■</option>')
		.attr({ selected: ( country == idx ), value: idx })
		.appendTo( $selecter );
	});

	//新合戦場が導入されていると思われる時に表示
	if ( Env.war == 2 || Map.info.isBattleMap ) {
		$('<option>■ 新合戦場１ ■</option>')
		.attr({ selected: ( country == 20 ), value: 20 })
		.appendTo( $selecter );

		$('<option>■ 新合戦場２ ■</option>')
		.attr({ selected: ( country == 21 ), value: 21 })
		.appendTo( $selecter );
	}

	$('<div/>').attr('id', 'imi_country_selecter').append( '現在', $selecter, 'を表示中' ).appendTo('#ig_mapbox');
},

//. fortressLink
fortressLink: function() {
	var compass = Data.compass,
		fortresses = Data.fortresses,
		html;

	html = '<table class="imc_table imc_fort">' +
		'<tr>' +
			'<th>' + compass[0].name + '</th>' +
			'<th>' + compass[1].name + '</th>' +
			'<th>' + compass[2].name + '</th>' +
			'<th>' + compass[3].name + '</th>' +
		'</tr>';

	html += fortresses.map(function( value, idx ) {
		//最初はダミー
		if ( idx == 0 ) { return; }

		var base_x = value[0],
			base_y = value[1],
			html;

		html = [ 0, 1, 2, 3 ].map(function( value ) {
			var x = base_x * compass[ value ].x,
				y = base_y * compass[ value ].y,
				name = compass[ value ].name + idx;

			return '<td data-x="' + x + '" data-y="' + y + '">' + name + '</td>';
		}).join('');

		return '<tr style="cursor: pointer">' + html + '</tr>';
	}).join('');

	html += '</table>';

	$( html ).appendTo('#imi_coord')
	.find('TR:gt(0) TD')
	.hover( Util.enter, Util.leave )
	.click(function() {
		var { x, y } = $(this).data();
		Map.move( x, y );
	});
},

//. fortressLink2
fortressLink2: function() {
	var list = Map.baseList,
		html;

	html = '<table class="imc_table imc_fort2">';

	list.forEach(function( value, idx ) {
		var { name, x, y, gage } = value;

		if ( idx % 6 == 0 ) {
			//大殿
			html += '<tr><th colspan="6">' + name + '</th></tr>' +
			'<tr style="cursor: pointer;">' +
			'<td style="width: 55px;" x="' + x + '" y="' + y + '">大殿城';

			if ( gage != undefined ) {
				html += '<table class="imc_table imc_gage">' +
				'<tr>' + '<td />'.repeat( gage ) + '<td class="imc_lose" />'.repeat( 10 - gage ) + '</tr>' +
				'</table>';
			}

			html += '</td>';
		}
		else {
			//砦
			html += '<td x="' + x + '" y="' + y + '">砦' + ( idx % 6 );

			if ( gage != undefined ) {
				html += '<table class="imc_table imc_gage">' +
				'<tr>' + '<td />'.repeat( gage ) + '<td class="imc_lose" />'.repeat( 5 - gage ) + '</tr>' +
				'</table>';
			}

			html += '</td>';

			if ( idx % 6 == 5 ) { html += '</tr>'; }
		}
	});

	html += '</table>';

	$( html ).appendTo('#imi_coord')
	.find('> TBODY > TR:gt(0) > TD')
	.hover( Util.enter, Util.leave )
	.click(function() {
		var $this = $(this);

		if ( $this.closest('TABLE').hasClass('imc_gage') ) {
			//ゲージをクリックした場合
			return true;
		}

		var x = $this.attr('x'),
			y = $this.attr('y');

		Map.move( x, y );
	});
}

});

//■ /war/list
Page.registerAction( 'war', 'list', {

//. style
style: '' +
/* 合戦報告書 */
'.ig_battle_pagelist { height: auto; padding: 5px 0px; }' +
'.ig_battle_pagelist UL { padding: 0px; margin: 0px; }' +
'#imi_list { width: 668px; height: 210px; margin-bottom: 15px; overflow-y: scroll; }' +
'#imi_list .imc_selected { background-color: #f9dea1; }' +
'#imi_war_detail { width: 668px; height: 480px; overflow: auto; }' +
'TABLE.ig_battle_table { position: relative; }' +
'TABLE.ig_battle_table TD { height: 18px; padding: 2px 8px; line-height: 18px; }' +
'TABLE.ig_battle_table TD A { line-height: 18px; }' +
'.ig_battle_report_icon1,' +
'.ig_battle_report_icon2 { float: left; width: 18px; height: 18px; }' +
'.ig_battle_report_text { float: left; width: 440px; height: 18px; padding: 0px 5px; line-height: 18px; }' +
'',

//. main
main: function() {
	this.layouter();
},

//. layouter
layouter: function() {
	//テーブル変更
	$('TABLE.ig_battle_table').wrap('<div id="imi_list" />');

	//ページャーを上に移動
	$('.ig_battle_pagelist').insertAfter( '#war_search' );
	$('.ig_battle_pagelist UL').addClass('pager');

	//詳細表示エリア作成
	$('#imi_list').after('<div id="imi_war_detail" />')
	.find('A').click( this.getDetail );
},

//. getDetail
getDetail: function() {
	var $this = $(this),
		href = $this.attr('href'),
		detailid = href.match(/id=(\d+)/)[1],
		$detail = $('#imi_war_detail DIV[detailid="' + detailid + '"]');

	$('#imi_list .imc_selected').removeClass('imc_selected');
	$this.closest('TR').addClass('imc_selected');

	if ( $detail.length == 1 ) {
		//既に取得している場合
		$('#imi_war_detail > DIV').hide();
		$detail.show();
	}
	else {
		Env.ajax = true;

		$.get( href )
		.pipe(function( html ) {
			var $html = $(html),
				$detail = $html.find('#ig_battle_reportdetail');

			if ( $detail.length == 0 ) { return $.Deferred().reject(); }

			$('#imi_war_detail')
			.children().hide().end()
			.append(
				$('<div detailid="' + detailid + '" />')
				.append( $detail.css('marginBottom', '20px') )
				.append( $html.find('#ig_battle_report_mid > #ig_battle_reportinfo') )
			);
		})
		.fail(function() {
			Display.alert('詳細情報を取得できませんでした。');
		})
		.always(function() {
			Env.ajax = false;
		});
	}

	return false;
}

});

//■ /war/detail
Page.registerAction( 'war', 'detail', {

//. main
main: function() {
	var $a = $('#ig_battlebox A').last(),
		href = $a.attr('href');

	href = href.replace(/ /g, '%2b');
	$a.attr('href', href);
}

});

//■ /country/all
Page.registerAction( 'country', 'all', {

//. style
style: '' +
/* 日本地図 */
'#ig_boxInner_japanmap { margin-bottom: 5px; padding: 0px !important; width: 936px !important; }' +
'#ig_battle_mainmenu { position: relative; top: 5px; margin-bottom: 15px; }' +
'.ig_japanrank_unitname { width: 169px; }' +
'.ig_japanrank_unitname IMG { margin-top: -2px; }' +
'.ig_japanrank_unitnow { width: 257px; }' +
''

});

//■ /country/country_ranking
Page.registerAction( 'country', 'country_ranking', {

//. main
main: function() {
	this.layouter();
},

//. layouter
layouter: function() {
	var list = [], total = [ 0, 0, 0, 0 ], html;

	$('.common_table1 TR').slice( 1 ).each(function() {
		var $this = $(this),
			$td = $this.find('TD'),
			now = $this.hasClass('now');

		list.push({ name: $td.eq( 1 ).text(), point: $td.eq( 3 ).text().toInt(), now: now });
	})

	html = '<table class="common_table1 center" width="700">' +
		'<tr><th colspan="4">第一組</th><th colspan="4">第二組</th>' +
		'<tr><th colspan="2">西軍</th><th colspan="2">東軍</th><th colspan="2">西軍</th><th colspan="2">東軍</th></tr>';

	'1 3 2 4 8 5 7 6 10 12 11 9'.split(' ').forEach(function( value, idx ) {
		var data = list[ value.toInt() - 1 ];

		if ( idx % 4 == 0 ) { html += '<tr>'; }

		if ( data.now ) {
			html += '<td width="13%" style="font-weight: bold; background-color: #f9dea1">' + data.name + '</td>' +
					'<td width="12%" style="font-weight: bold; background-color: #f9dea1">' + data.point + '</td>';
		}
		else {
			html += '<td width="13%">' + data.name + '</td><td width="12%">' + data.point + '</td>';
		}

		total[ idx % 4 ] += data.point;

		if ( idx % 4 == 3 ) { html += '</tr>'; }
	});

	html += '<tr>';

	total.forEach(function( value ) {
		html += '<th>合計</th><td>' + value + '</td>';
	})

	html += '</tr></table>';

	$('.common_table1').after( html );
}

});

//■ /alliance/info
Page.registerAction( 'alliance', 'info', {

//. main
main: function() {
	this.layouter();
},

//. layouter
layouter: function() {
	var storage = MetaStorage('ALLIANCE'),
		id = ( location.search.match(/id=(\d+)/) || [,0] )[1],
		olddata = {}, newdata = {}, total = 0;

	if ( storage.get('id') == id ) {
		olddata = storage.get('data');
	}

	$('TABLE.common_table1').find('TR:gt(0)').each(function() {
		var $this = $(this),
			href  = $this.find('A:first').attr('href') || '',
			userid = ( href.match( /user_id=(\d+)/ ) || [] )[1],
			point = $this.find('TD:eq(2)').text().toInt();

		if ( userid in olddata ) {
			var diff = point - olddata[ userid ];
			if ( diff != 0 ) {
				if ( diff > 0 ) { diff = '+' + diff; }
				//前回と比べて差があれば表示
				$this.find('TD:eq(2)').append(' (' + diff + ')');
			}
		}

		newdata[ userid ] = point;
		total += point;
	})
	.end()
	.append(
		'<tr><th colspan="2" style="line-height: 1.5">合計</th><td>' + total.toFormatNumber()
		+ (function() {
			var html = '';

			if ( storage.get('id') == id ) {
				var diff = total - storage.get('total');
				if ( diff != 0 ) {
					if ( diff > 0 ) { diff = '+' + diff; }
					html = '<br/>(' + diff + ')';
				}
			}

			return html;
		})()
		+ '</td><th colspan="3" style="line-height: 1.5">与戦功</th><td>'
		+ (function() {
			var result = Math.floor( total / 500 );

			if ( result > 500000 ) { result = 500000; }

			return result.toFormatNumber();
		})()
		+ '</td></tr>'
	);

	storage.begin();
	storage.set( 'id', id );
	storage.set( 'data', newdata );
	storage.set( 'total', total );
	storage.commit();
}

});

//■ /alliance/level
Page.registerAction( 'alliance', 'level', {

//. style
style: '' +
'INPUT { ime-mode: disabled; }' +
''

});

//■ /alliance/list
Page.registerAction( 'alliance', 'list', {

//. style
style: Page.getAction( 'user', 'ranking', 'style' )

});

//■ /alliance/alliance_list_history
Page.registerAction( 'alliance', 'alliance_list_history', {

//. style
style: Page.getAction( 'user', 'ranking', 'style' )

});

//■ /alliance/alliance_gold_mine_history
Page.registerAction( 'alliance', 'alliance_gold_mine_history', {

//.style
style: '' +
'TD.imc_wood  { background-color: #b75; }' +
'TD.imc_stone { background-color: #5b7; }' +
'TD.imc_iron  { background-color: #b7b; }' +
'TD.imc_rice  { background-color: #bb5; }' +
'',

//. main
main: function() {
	var data = { '青龍': 'imc_wood', '朱雀': 'imc_stone', '白虎': 'imc_iron', '玄武': 'imc_rice' };

	$('#data_gold_mine_navi_deck').find('TR').slice( 1 ).each(function() {
		var $td = $(this).find('TD').eq( 1 );

		$td.addClass( data[ $td.text() ] );
	});
}

});

//■ /report/list
Page.registerAction( 'report', 'list', {

//. style
style: '' +
/* 報告書 */
'#ig_deckheadmenubox { height: 55px; }' +
'.ig_decksection_innertop { height: 8px; }' +
'#imi_list { width: 710px; height: 210px; margin-bottom: 10px; overflow-y: scroll; }' +
'#imi_list .imc_selected TD { background-color: #f9dea1; }' +
'#imi_list TABLE { position: relative; width: 690px; margin: 0px; }' +
'#imi_list TABLE TD { height: 18px; padding: 2px 8px; line-height: 18px; }' +
'#imi_report_detail { width: 710px; min-height: 500px; }' +
'#imi_report_detail TABLE { width: 100%; }' +
'UL.pager { padding: 7px 0px 5px 0px; margin: 0px; }' +
'',

//. main
main: function() {
	var css_file = Env.externalFilePath + '/css/b_report_new.css';
	$('<link/>').attr({ rel: 'stylesheet', type: 'text/css', href: css_file }).appendTo('HEAD');

	this.layouter();
},

//. layouter
layouter: function() {
	$('#ig_deckmenu').remove();

	//テーブル変更
	$table = $('TABLE.p_report').wrap('<div id="imi_list" />');

	//幅微調整
	$table.find('TH')
	.eq( 0 ).width( 30 ).end()
	.eq( 1 ).width( 50 ).end()
	.eq( 3 ).width( 90 ).end();

	//詳細表示エリア作成
	$('#imi_list').after('<div id="imi_report_detail" />');

	//詳細をajaxで取得する
	$table.find('A[href^="detail.php"]').click( this.getDetail );

	//下部ボタンを上へ移動
	var $menu = $('.statMenu');
	var $button = $('#imi_report_detail').nextUntil('.pager');
	$menu.eq( 0 ).append( $button.get().reverse() );
	$button.wrap('<LI class="right last r_input" />');

	var $li = $menu.eq( 1 ).find('LI').first();
	$li.addClass('right').removeClass('last');
	$menu.eq( 0 ).append( $li.get().reverse() );
	$menu.eq( 1 ).remove();

	//ページャーを上へ移動
	$('.pager').insertBefore('#imi_list');
},

//. getDetail
getDetail: function() {
	var $this = $(this),
		$tr = $this.closest('TR'),
		href = $this.attr('href'),
		detailid = href.match(/id=(\d+)/)[1],
		$detail = $('#imi_report_detail DIV[detailid="' + detailid + '"]');

	$('#imi_list .imc_selected').removeClass('imc_selected');
	$tr.addClass('imc_selected');

	if ( $detail.length == 1 ) {
		//既に取得している場合
		$('#imi_report_detail > DIV').hide();
		$detail.show();
	}
	else {
		Env.ajax = true;

		$.get( href )
		.pipe(function( html ) {
			var $html = $(html),
				$table = $html.find('.ig_decksection_innermid').children('TABLE');

			$('#imi_report_detail')
			.children().hide().end()
			.append(
				$('<div detailid="' + detailid + '" />')
				.append( $table )
				.prepend( $table.last() )
				.prepend( $table.first() )
			);

			$tr.removeClass('noread');
		})
		.always(function() {
			Env.ajax = false;
		});
	}

	return false;
}

});

//■ /message/inbox
Page.registerAction( 'message', 'inbox', {

//. style
style: '' +
/* 受信箱 */
'#ig_deckheadmenubox.normal { height: 55px; margin-bottom: 0px; }' +
'#ig_deckmenu { width: 710px; padding: 0px; position: static; margin: 0px auto; color: black; }' +
'#ig_deckmenu UL.secondmenu { width: 100%; padding: 0px; }' +
'#ig_deckmenu LI { margin: 2px 0px; padding: 0px 8px; }' +
'#ig_deckmenu LI.textmenu { margin: 7px 0px; }' +
'.common_box3bottom { padding: 0px 15px 15px 12px; }' +
'#imi_list { width: 710px; height: 210px; margin: 0px auto; margin-bottom: 10px; overflow-y: scroll; }' +
'#imi_list .imc_selected { background-color: #f9dea1; }' +
'#imi_list TABLE { position: relative; }' +
'#imi_list TABLE TD { height: 18px; padding: 2px 8px; line-height: 18px; }' +
'#imi_message_detail { width: 710px; min-height: 500px; margin: 0px auto; }' +
'UL.pager { padding: 0px; margin: 5px 0px 5px 0px; }' +
'',

//. main
main: function() {
	this.layouter();
},

//. layouter
layouter: function() {
	var $table, $menu;

	//プロフィール等リンク・全件表示ボタン・未読のみ表示ボタン削除
	$('#ig_deckmenu UL').not('.secondmenu').remove();
	$('.common_box3bottom > P').remove();
	$('#ig_deckmenu').removeAttr('class').prependTo('FORM');

	//テーブル変更
	$table = $('TABLE.common_table1').wrap('<div id="imi_list" />');

	//幅微調整
	$table.find('TH')
	.eq( 3 ).width( 110 ).end()
	.eq( 4 ).width( 35 ).end();

	//ロックされているものはチェックボックスを無効にする
	$table.find('TD.rock').parent().find('INPUT').attr('disabled', true);

	//詳細表示エリア作成
	$('#imi_list').after('<div id="imi_message_detail" />');

	//詳細をajaxで取得する
	$table.find('A[href^="detail.php"]').click( this.getDetail );

	//ページャーを上に移動
	$('.common_box3bottom > .pager').insertBefore('#imi_list');

	//各種ボタン
	$menu = $('#ig_deckmenu .secondmenu');
	$menu.find('LI').addClass('textmenu');

	$('FORM').find('P INPUT').appendTo( $menu )
	.wrap('<LI style="float: right; border-right: none;" />');

	$('<button key="落札">取引結果を選択</button>').appendTo( $menu )
	.click( this.selectReport )
	.wrap('<LI style="float: right; border-right: none; padding-right: 0px;" />');
},

//. getDetail
getDetail: function() {
	var $this = $(this),
		$tr = $this.closest('TR'),
		href = $this.attr('href'),
		detailid = href.match(/id=(\d+)/)[1],
		$detail = $('#imi_message_detail DIV[detailid="' + detailid + '"]');

	$('#imi_list .imc_selected').removeClass('imc_selected');
	$tr.addClass('imc_selected');

	if ( $detail.length == 1 ) {
		//既に取得している場合
		$('#imi_message_detail > DIV').hide();
		$detail.show();
	}
	else {
		Env.ajax = true;

		$.get( href )
		.pipe(function( html ) {
			var $html = $(html);

			$('#imi_message_detail')
			.children().hide().end()
			.append(
				$('<div detailid="' + detailid + '" />')
				.append( $html.find('TABLE.common_table1').css('marginBottom', '20px') )
			);

			$tr.removeClass('unread');
		})
		.always(function() {
			Env.ajax = false;
		});
	}

	return false;
},

//. selectReport
selectReport: function() {
	var key = $(this).attr('key'),
		regex = new RegExp( key );

	$('#imi_list').find('TR').each(function() {
		var $this = $(this),
			$td = $this.find('TD');

		if ( !regex.test( $td.eq( 1 ).find('A').text() ) ) { return; }
		if ( $td.eq( 2 ).text().trim() != '戦国IXA運営チーム' ) { return; }

		$td.eq( 0 ).find('INPUT:enabled').attr('checked', true);
	});

	return false;
}

});

//■ /message/new
Page.registerAction( 'message', 'new', {

//. main
main: function() {
	$('.common_textarea1').height( 300 );
}

});

//■ /union/union_levelup
Page.registerAction( 'union', 'union_levelup', {

//. main
main: function() {
	$('INPUT:radio:enabled').first().attr('checked', true);

	this.layouter();
},

//. layouter
layouter: function() {
	$('.addslot').appendTo('.common_box3bottom');

	$('TABLE.common_table1 TR')
	.hover( Util.enter, Util.leave )
	.click(function( e ) {
		var tagName = e.target.tagName.toUpperCase();

		if ( tagName == 'INPUT' ) { return; }

		$(this).find('INPUT').attr('checked', true);
	});
}

});

//■ /union/union_remove
Page.registerAction( 'union', 'union_remove', {

//. main
main: function() {
	this.layouter();
},

//. layouter
layouter: Page.getAction( 'union', 'union_levelup', 'layouter' )

});

//■ /union/result
Page.registerAction( 'union', 'result', {

//. main
main: function() {
	var search = location.search,
		cid = search.match(/cid=(\d+)/)[ 1 ],
		type = search.match(/ut=(\d)/)[ 1 ];

	if ( type == '4' ) {
		this.layouter( cid );
	}
},

//. layouter
layouter: function( cid ) {
	if ( $('IMG[src$="hd_success.jpg"]').length == 0 ) { return; }

	var html = '<span class="rankup_btn"><a href="/card/lead_info.php?cid=' + cid + '&p=1&ano=0&dmo=nomal">指揮力強化</a></span>';
	$('.parameta_area').append( html );
}

});

//■ /senkuji/senkuji_result
Page.registerAction( 'senkuji', 'senkuji_result', {

//. main
main: function() {
	$('FORM + A').focus();
}

});

//■ /senkuji/senkuji_lineup
Page.registerAction( 'senkuji', 'senkuji_lineup', {

//. style
style: '' +
'.ig_deck_smallcardarea { border-bottom: solid 1px #666; }' +
''

});

//■ /quest/index
Page.registerAction( 'quest', 'index', {

//. style
style: '' +
'INPUT { ime-mode: disabled; }' +
''

});

//■■■■■■■■■■■■■■■■■■■

//■ キーバインド：前処理
Page.registerExtention(
	'/war/war_ranking',
	'/war/war_alliance_ranking',
function() {
	$('.ig_battle_pagelist UL').addClass('pager');
});


//■ キーバインド：ページャー
Page.registerExtention(
	'/user/ranking',
	'/user/ranking_history',
	'/user/present_history',
	'/card/trade',
	'/card/trade_card',
	'/war/list',
	'/war/war_ranking',
	'/war/war_alliance_ranking',
	'/alliance/list',
	'/alliance/alliance_list_history',
	'/bbs/topic_view',
	'/report/list',
	'/message/inbox',
	'/union/union_history',
	'/senkuji/senkuji_history',
	'/senkuji/senkuji_lineup',
	Util.keyBindPager
);

//■ キーバインド：件名選択
Page.registerExtention(
	'/war/list',
	'/report/list',
	'/message/inbox',
function() {
	$(document).keybind({
		'w': Util.keyBindCallback(function() {
			selector( 'prev' );
			return false;
		}),

		's': Util.keyBindCallback(function() {
			selector( 'next' );
			return false;
		})
	});

	function selector( way ) {
		if ( Env.ajax ) { return; }

		var $tr = $('#imi_list TR.imc_selected');
		if ( $tr.length == 0 ) {
			if ( way == 'prev' ) {
				$tr = $('#imi_list TR').has('A').last();
			}
			else {
				$tr = $('#imi_list TR').has('A').first();
			}
		}
		else {
			if ( way == 'prev' ) {
				$tr = $tr.prev();
			}
			else {
				$tr = $tr.next();
			}
		}

		var $a = $tr.find('A').first();
		if ( $a.length == 1 ) {
			var position = $a.closest('TR').position();
			$('#imi_list').scrollTop( position.top - 24 );
			$a.click();
		}
	}
});

//■■■■■■■■■■■■■■■■■■■

//■ 実行
Page( Env.path ).execute();

//■■■■■■■■■■■■■■■■■■■

})( jQuery );
