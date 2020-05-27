$(function(){
	var ieTest = false,
		screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		imgURL = "http://img.khan.co.kr/spko/storytelling/2020/underground/",
		isMobile = screenWidth <= 800 && true || false,
		isNotebook = (screenWidth <= 1300 && screenHeight < 750) && true || false,
		isMobileLandscape = ( screenWidth > 400 && screenWidth <= 800 && screenHeight < 450 ) && true || false;
	window.onbeforeunload = function(){ window.scrollTo(0, 0) ;}
	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};
	$(window).resize(function() {
		screenWidth = $(window).width();
		screenHeight = $(window).height();
    });

	$(".close-ie-block").on("click", function(){
		$(".ie-block-9").hide();
	})

	function animateValue(id, start, end, duration) {
		var range = end - start;
		var current = start;
		var increment = end > start ? 1 : -1;
		var stepTime = Math.abs(Math.floor(duration / range));
		var obj = document.getElementById(id);
		var timer = setInterval(function(){
				current = Number((current + increment).toFixed(1));
				obj.innerHTML = current;
				if (current == Math.floor(end)) {
					increment = increment / 10;
				}
				if (current == end) {
					clearInterval(timer);
					$("body").removeClass("fixed");
				}
			}, stepTime);
	}


	/***** 사건 카드 생성 관련 함수들 *****/
	function resetSectionBody(){
		$(".each-section").each(function(index,item){
			$(item).find(".section-body").html("");
		});
	};

	function getCardTemplate(elType, cardid){
		var id = cardid;
		switch (elType){
			case "card":
				return "<div class='timeline-el el-card el-with-img "+id+"'><p class='el-year'><span class='year'></span><span class='spot'></span></p><div class='card-body'><div class='arrow'><img src='img/"+id+".jpg' alt=''></div><div class='card-thumb'><img src='' alt=''><div class='thumb-shade'></div></div><div class='card-text'><p class='card-title'></p><p class='card-desc-point'></p></div><div class='view-card'><p>사건 설명 더보기 +</p></div></div><div class='card-share'><div class='share_fb'><a onclick='sendSns('facebook'); return false;'><img src='img/fb_icon_line_w.png' alt='페이스북' /></a></div><div class='share_tw'><a onclick='sendSns('twitter'); return false;'><img src='img/tw_icon_line_w.png' alt='트위터' /></a></div></div></div>";
				break;
			case "simple-card":
				return "<div class='timeline-el el-simple-card el-no-img "+id+"'><p class='el-year'><span class='year'></span><span class='spot'></span></p><div class='card-body'><div class='arrow'><img src='' alt=''></div><div class='card-text'><p class='card-title'></p><p class='card-desc-point'></p></div></div></div>";
				break;
			case "simple":
				return "<div class='timeline-el el-simple "+id+"'><p class='el-year'><span class='year'></span><span class='spot'></span></p><div class='card-body'><div class='card-text'><p class='card-title'></p></div></div></div>";
				break;
		}
	};



	function makeSectionCard(){
		resetSectionBody();
		var data = cardData;
		for(d=0;d<data.length;d++){
			var sec = String(data[d]["sec"]).replace("s","");
			var cardTemplate = getCardTemplate( data[d]["elType"],data[d]["id"] );
			var $sectionBody = $(".each-section").eq(sec-1).find(".section-body");

			$sectionBody.append(cardTemplate);
			var $this_card = $("."+data[d]["id"]);
			$this_card.attr("data-id", data[d]["id"]);

			$this_card.find(".el-year .year").html(data[d]["ymd"]);
			$this_card.find(".card-title").html(data[d]["title"]);
			$this_card.addClass("el-"+data[d]["line"]);

			if(data[d]["line"]=="center"){
				$this_card.find(".arrow").addClass("arrow-up");
				$this_card.find(".arrow img").attr("src", "img/arrow-up.png");
			}else if(data[d]["line"]=="right"){
				$this_card.find(".arrow").addClass("arrow-right");
				$this_card.find(".arrow img").attr("src", "img/arrow-right.png");
			}else if(data[d]["line"]=="left"){
				$this_card.find(".arrow").addClass("arrow-left");
				$this_card.find(".arrow img").attr("src", "img/arrow-left.png");
			}

			if( (data[d]["pointTxt"]!==null )&&$this_card.find(".card-desc-point").length){
				$this_card.find(".card-desc-point").html(data[d]["pointTxt"]);
			}

			if( (data[d]["thumb"]!==null )&&$this_card.find(".card-thumb").length){
				$this_card.find(".card-thumb img").attr("src", "img/"+data[d]["id"]+".jpg");
			}

			if(data[d]["relCode"] !== null ){
				$this_card.append("<div class='show-rel-card'><div class='rel-icon'><img src='img/rel-icon-2.png' alt='관련사건타래보기'><span class='icon-desc'>사건 타래 보기</span></div></div>");
				$this_card.find(".show-rel-card").attr("data-rel-id", data[d]["relCode"]);
				$this_card.addClass("el-with-rel");
			}
			
			if(d==data.length-1){
				setSectionHeight();
				addCardNavi();
				addCardSvg();
			}
		}


	};

	function setSectionHeight(){
		var $allSec = $(".each-section");
		$allSec.each(function(index,item){
			var sec_item = $(item).find(".timeline-el");
			if( sec_item.length !==0){
				var temH = 0;
				var item_margin = 20;
				console.log(sec_item.length);
				var last_item_pos = Number(sec_item.eq(sec_item.length-1).css("top").replace("px",""));
				temH = last_item_pos + sec_item.eq(sec_item.length-1).height() + item_margin;
				console.log(temH);
				$(item).find(".section-body").css({"height":temH+"px"});
			}
		})	
		getTimelineHeight();
	};

	function addCardNavi(){
		$(".timeline-el").each(function(index,item){
			$(item).append("<div class='filter-card-navi'><div class='arr-up'><img src='img/arr-up-or.png' alt='필터링사건안에서이동'></div><div class='arr-down'><img src='img/arr-down-or.png' alt='필터링사건안에서이동'></div><div class='filter-exit'><img src='img/exit-icon-or.png' alt='필터링끄기'></div><div class='arr-info'><span class='f_i'></span><span class='slash'>/</span><span class='total'></span></div></div>");
		});
	};

	function addCardSvg(){
		$(".timeline-el").each(function(index,item){
			if($(item).hasClass("el-with-rel")){
				$(item).append("<svg id='svg-"+$(item).attr("data-id")+"'></svg>");
			}
		});

		var svgS1e1 = document.getElementById("svg-s1-e1");
		var pathS1e1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES1e1 = svgS1e1.appendChild(pathS1e1);
		pES1e1.setAttributeNS(null,"d","M0,0 Q200,600 0,4000");
		pES1e1.setAttributeNS(null,"class","line-noraml");

		var svgS1e2 = document.getElementById("svg-s1-e2");
		var pathS1e2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES1e2 = svgS1e2.appendChild(pathS1e2);
		pES1e2.setAttributeNS(null,"d","M0,0 Q400,12000 0,22600");
		pES1e2.setAttributeNS(null,"class","line-noraml");

		var svgS3e2 = document.getElementById("svg-s3-e2");
		var pathS3e2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES3e2 = svgS3e2.appendChild(pathS3e2);
		pES3e2.setAttributeNS(null,"d","M0,0 Q-100,250 0,400");
		pES3e2.setAttributeNS(null,"class","line-noraml");

		var svgS3e4 = document.getElementById("svg-s3-e4");
		var pathS3e4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES3e4 = svgS3e4.appendChild(pathS3e4);
		pES3e4.setAttributeNS(null,"d","M0,0 Q500,500 350,1000");
		pES3e4.setAttributeNS(null,"class","line-noraml");

		var svgS3e3 = document.getElementById("svg-s3-e3");
		var pathS3e3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES3e3 = svgS3e3.appendChild(pathS3e3);
		pES3e3.setAttributeNS(null,"d","M0,0 Q-100,700 100,1600");
		pES3e3.setAttributeNS(null,"class","line-noraml");

		var svgS4e1 = document.getElementById("svg-s4-e1");
		var pathS4e1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES4e1 = svgS4e1.appendChild(pathS4e1);
		pES4e1.setAttributeNS(null,"d","M0,0 Q-100,1500 300,2500");
		pES4e1.setAttributeNS(null,"class","line-noraml");


		var svgS4e4 = document.getElementById("svg-s4-e4");
		var pathS4e4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES4e4 = svgS4e4.appendChild(pathS4e4);
		pES4e4.setAttributeNS(null,"d","M120,0 Q600,4000 50,6650");
		pES4e4.setAttributeNS(null,"class","line-noraml");

		var svgS5e2 = document.getElementById("svg-s5-e2");
		var pathS5e2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES5e2 = svgS5e2.appendChild(pathS5e2);
		pES5e2.setAttributeNS(null,"d","M0,0 Q600,250 350,700");
		pES5e2.setAttributeNS(null,"class","line-noraml");

		var svgS6e2 = document.getElementById("svg-s6-e2");
		var pathS6e2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES6e2 = svgS6e2.appendChild(pathS6e2);
		pES6e2.setAttributeNS(null,"d","M0,0 Q-400,2500 100,5400");
		pES6e2.setAttributeNS(null,"class","line-noraml");

		var svgS6e4 = document.getElementById("svg-s6-e4");
		var pathS6e4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES6e4 = svgS6e4.appendChild(pathS6e4);
		pES6e4.setAttributeNS(null,"d","M0,0 Q-400,6500 200,8200");
		pES6e4.setAttributeNS(null,"class","line-noraml");

		var svgS7e2 = document.getElementById("svg-s7-e2");
		var pathS7e2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var pES7e2 = svgS7e2.appendChild(pathS7e2);
		pES7e2.setAttributeNS(null,"d","M0,0 Q-300,1700 350,2800");
		pES7e2.setAttributeNS(null,"class","line-noraml");

		var pathS8e5 = document.getElementById("svg-s8-e5").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS8e5.setAttributeNS(null,"d","M50,0 Q-300,3000 400,4500");

		var pathS8e7 = document.getElementById("svg-s8-e7").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS8e7.setAttributeNS(null,"d","M100,0 Q1000,3000 50,9000");

		var pathS8e9 = document.getElementById("svg-s8-e9").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS8e9.setAttributeNS(null,"d","M50,0 Q-100,2000 600,3000");

		var pathS10e1 = document.getElementById("svg-s10-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS10e1.setAttributeNS(null,"d","M100,0 Q500,600 300,1450");

		var pathS10e3 = document.getElementById("svg-s10-e3").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS10e3.setAttributeNS(null,"d","M250,0 Q-200,2500 600,5700");

		var pathS10e4 = document.getElementById("svg-s10-e4").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS10e4.setAttributeNS(null,"d","M50,0 Q-500,3000 300,7000");

		var pathS11e5 = document.getElementById("svg-s11-e5").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS11e5.setAttributeNS(null,"d","M300,0 Q320,50 350,120");

		var pathS11e6 = document.getElementById("svg-s11-e6").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS11e6.setAttributeNS(null,"d","M50,0 Q500,2000 0,8700");

		var pathS12e2 = document.getElementById("svg-s12-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS12e2.setAttributeNS(null,"d","M0,0 Q600,1200 400,2050");

		var pathS13e1 = document.getElementById("svg-s13-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS13e1.setAttributeNS(null,"d","M250,0 Q-100,2000 500,4100");

		var pathS13e2 = document.getElementById("svg-s13-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS13e2.setAttributeNS(null,"d","M50,0 Q-200,3000 400,4900");
		
		var pathS13e3 = document.getElementById("svg-s13-e3").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS13e3.setAttributeNS(null,"d","M50,0 Q-200,3000 700,3500");

		var pathS13e12 = document.getElementById("svg-s13-e12").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS13e12.setAttributeNS(null,"d","M150,0 Q400,1200 0,2400");

		var pathS13e6 = document.getElementById("svg-s13-e6").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS13e6.setAttributeNS(null,"d","M50,0 Q-300,600 250,1220");

		var pathS13e7 = document.getElementById("svg-s13-e7").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS13e7.setAttributeNS(null,"d","M50,0 Q-100,2500 420,3300");

		var pathS13e13 = document.getElementById("svg-s13-e13").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS13e13.setAttributeNS(null,"d","M100,0 Q600,1000 50,1950");

		var pathS14e1 = document.getElementById("svg-s14-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS14e1.setAttributeNS(null,"d","M100,0 Q-100,1500 400,2850");		

		var pathS14e2 = document.getElementById("svg-s14-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS14e2.setAttributeNS(null,"d","M100,0 Q300,900 500,1780");

		var pathS14e8 = document.getElementById("svg-s14-e8").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS14e8.setAttributeNS(null,"d","M300,0 Q-100,900 600,1720");

		var pathS14e11 = document.getElementById("svg-s14-e11").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS14e11.setAttributeNS(null,"d","M220,0 Q400,1200 300,1350");

		var pathS15e1 = document.getElementById("svg-s15-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		pathS15e1.setAttributeNS(null,"d","M200,0 Q350,300 300,400");		

	};

// svg-s7-e2 200 2800

	function getTimelineHeight(){
		timelineEndPos = $(".timeline-holder").offset().top + $(".timeline-holder").height();
	};

	/***** 사건 카드 생성 관련 함수들 *****/


	/***사건 팝업카드 관련**/
	function makePopCard(cardId){
		var selectItemData;
		for(c=0;c<cardData.length;c++){
			if(cardData[c]["id"] == cardId){
				selectItemData = cardData[c];
				break;
			}
		}
		console.log(selectItemData);
		$(".popUp-front").find(".year").html(selectItemData["ymd"]);
		$(".popUp-front").find(".thumb-holder img").attr("src", "img/"+selectItemData["thumb"]+".jpg");
		$(".popUp-front").find(".popUp-card-title").html(selectItemData["title"]);
		$(".popUp-front").find(".popUp-card-point-text p").html(selectItemData["pointTxt"]);
		$(".popUp-front").find(".popUp-card-full-text").html(selectItemData["fullTxt"]);
		
		/*
		if(selectItemData["relCode"]!==null){
			$(".popUp-body .show-rel-card").show();
			$(".popUp-body .show-rel-card").attr("data-rel-id", selectItemData["relCode"]);
		}else{
			$(".popUp-body .show-rel-card").hide();
		}*/

		var tagArr = new Array;
		if(selectItemData["tag"]!==null){
			tagArr = selectItemData["tag"].split(",");
			$(".popUp-card-tag .tag-list").html("");
			tagArr.map(function(v,i,a){
				if(a[i].length>0){
					var spanTag = "<span>"+a[i]+"</span>";
					$(".popUp-card-tag .tag-list").append(spanTag);
				}
			});
			$(".popUp-card-tag").show();
		}else{
			$(".popUp-card-tag").hide();
		}

		fadeInPopCard();
	};
	function hidePopCard(){
		$(".popUp-front").css({"top":"100px", "opacity":"0"});
	}
	function fadeInPopCard(){
		$(".popUp-layer").show();
		$(".popUp-front").animate({"top":"0px", "opacity":"1"},400,"easeOutCubic");
	}
	/***사건 팝업카드 관련**/

	
	
	/***** 사건 타래 관련 함수 *****/
	var relAct = false;

	$(".section-body").delegate(".show-rel-card","click", function(){
		if(relAct ==false ){
			relAct = true;
			var relCode = $(this).attr("data-rel-id");
			findRelCard(relCode);
		}
	});
	
	function findRelCard(code){
		$(".fixed-focus-item-list .focus-title .code").html(code);
		$(".fixed-focus-item-list .item-list-wrap ul").html("");

		var relCardIdArr = new Array;
		for(c=0;c<cardData.length;c++){
			if(cardData[c]["relCode"] == code){
				relCardIdArr.push(cardData[c]["id"]);
				pushFocusItem(cardData[c]["title"]);
			}
		}
		getRelCardPos(relCardIdArr);
		focusingCard(relCardIdArr);
	};

	var relCardPos;
	function getRelCardPos(arr){
		relCardPos = [];
		for(a=0; a<arr.length;a++){
			relCardPos.push( $("."+arr[a]).offset().top);
		}
		afterRelAct();
		console.log(relCardPos);
		return relCardPos;
	};


	function afterRelAct(){
		var firstRelItemPos = relCardPos[0]-(screenHeight*0.4);
		$("html, body").animate({scrollTop: firstRelItemPos}, 700, "easeOutCubic");
		makeFilterToggleUnable();
		$(".fixed-focus-item-list").fadeIn();
	};

	function focusingCard(arr){
		$(".timeline-el").addClass("timeline-el-off");
		$(".sec-title").addClass("sec-title-off");
		for(a=0; a<arr.length;a++){
			$("."+arr[a]).addClass("timeline-el-focus");
			$("."+arr[a]).attr("data-focus-index", a);
			$("."+arr[a]).find(".f_i").html(a+1);
			$("."+arr[a]).find(".total").html(arr.length);
		};
		$(".timeline-el-focus").eq(0).find(".arr-up").hide();
		$(".timeline-el-focus").eq(arr.length-1).find(".arr-down").hide();
	};

	function makeFilterToggleUnable(){
		$(".filter-toggle-button").addClass("button-block");
		filterTabOpen=false;
		$(".filter-toggle").removeClass("filter-toggle-on");
		$(".filter-list").slideUp();
	};

	function makeFilterToggleAble(){
		$(".filter-toggle-button").removeClass("button-block");
	};

	function pushFocusItem(itemTitle){
		var listItem = "<li>"+itemTitle+"</li>";
		$(".fixed-focus-item-list .item-list-wrap ul").append(listItem);
	};	

	/***** 사건 타래 관련 함수 *****/


	/**** 카드 필터링 관련 함수들 ***/
	function getFilterdCard(code){
		var tag = code.replace("#", "");
		console.log(tag);
		var filteredCardIdArr = new Array;
		for(c=0;c<cardData.length;c++){
			if(cardData[c]["tag"] == tag){
				filteredCardIdArr.push(cardData[c]["id"]);
			}
		}

		focusingCard(filteredCardIdArr);
		getFilterdCardPos(filteredCardIdArr);
	};

	function getFilterdCardPos(arr){
		filteredCardPos = [];
		for(a=0; a<arr.length;a++){
			filteredCardPos.push( $("."+arr[a]).offset().top);
		}
		afterFitered();
		return filteredCardPos;
	};

	function afterFitered(){
		var firstFiltedItemPos = filteredCardPos[0]-(screenHeight*0.4);
		$("html, body").animate({scrollTop: firstFiltedItemPos}, 700, "easeOutCubic");
		filterTabOpen=false;
		$(".filter-toggle").removeClass("filter-toggle-on");
		$(".filter-list").slideUp();
	};

	function resolveFocusing(){
		$(".filter-list ul li").removeClass("on");
		$(".filter-list ul li").remove(".exit");
		$(".timeline-el").removeClass("timeline-el-off timeline-el-focus");
		$(".timeline-el").removeAttr("data-focus-index");
		$(".sec-title").removeClass("sec-title-off");
		$(".fixed-focus-item-list").hide();
		$(".filter-toggle-button").removeClass("filter-toggle-button-selected");
		makeFilterToggleAble();
	};
	/**** 카드 필터링 관련 함수들 ***/


	// 2 cut frame Animation
	function makeFrameAni(ob, time){
		var $itemDiv = ob;
		var moveValue = $itemDiv.width() / 2;
		function itemBlinking(){
			$itemDiv.css({"left": -moveValue + "px"});
			setTimeout(function(){
				$itemDiv.css({"left": 0});
				itemBlinkingReverse()
			}, time);
		}
		function itemBlinkingReverse(){
			setTimeout(function(){
				$itemDiv.css({"left": -moveValue + "px"});
			}, time);
		}
		var itemBlinkingRepeat = setInterval( function(){ itemBlinking() }, time*2);
	};
	 makeFrameAni($(".top-graphic-device img"), 600);		


	/******** 모바일 전용 조정 ********/
	if(isMobile==true){
		
	
	}
	/******** 모바일 전용 조정 ********/

	/******** init page ********/

	function init(){
		makeSectionCard();
		hidePopCard();
		var adjValue = (($(".story-header").height()-$(".story-header-front").height())/2)-40;
		$(".story-header-front").animate({"top":adjValue+"px", "opacity":"1"}, 500);
	}

	$(".loading-page").fadeOut(200, function(){
		init();
	});
	/******** init page ********/

	/******** Scroll event listener ********/
	var nowScroll;
	var timeWarpDone = false; 
	var timeWarpPoint = $(".time-warp .button").position().top-(screenHeight*0.7);
	var warpPos = $(".time-warp .button").position().top-(screenHeight*0.3);
	var timelineStartPos = $(".timeline-holder").offset().top,
		timelineEndPos = 0; 
	
	function animateTimeWarp(){
		$("body").addClass("fixed");
		$("html, body").animate({scrollTop: warpPos}, 700, "easeOutCubic", animateValue("YEAR_COUNTING", 2020, 1953, 2000) );
		$("#YEAR_COUNTING").addClass("removeBlur");
		$(".timeline-holder").delay(500).animate({"opacity":"1"}, 1500);
	};
	

	$(window).scroll(function(){
		var nowScroll = $(window).scrollTop();
		var timelineScroll = nowScroll-timelineStartPos+screenHeight,
			timelinefullScroll = $(".timeline-holder").height(),	
			ScrollPer = (timelineScroll/timelinefullScroll)*100;
	
		if(nowScroll >timeWarpPoint&&timeWarpDone==false){
			timeWarpDone=true;
			//animateTimeWarp();
		}

		if(nowScroll>=timelineStartPos &&nowScroll< timelineEndPos){
			$(".card-filter").addClass("card-filter-fixed");
			$(".fixed-navi").fadeIn();
			if(isMobile==true){
				$(".progress").css({"width":ScrollPer+"%"});
			}else {
				$(".progress").css({"height":ScrollPer+"%"});
			}
		}else if(nowScroll<timelineStartPos|| nowScroll>=timelineEndPos){
			$(".card-filter").removeClass("card-filter-fixed");
			$(".fixed-navi").hide();
		}

	});
	/******** Scroll event listener ********/

	var filterTabOpen = false,
		filterAct = false,
		filteredCardIndex = new Array,
		filteredCardPos = new Array;

	$(".timeline-holder").delegate(".el-card .card-body", "mouseover", function(e){
		if(!isMobile){
			$(this).addClass("card-body-hover");
		}
	}).delegate(".el-card .card-body", "mouseout", function(){
		$(this).removeClass("card-body-hover");
	}).delegate(".el-card .card-body", "click", function(e){
		var thisCardId = $(this).parent(".timeline-el").attr("data-id");
		makePopCard(thisCardId);
	});

	$("#CARD_CLOSE_BTN, .popUp-back").on("click", function(){
		$(".popUp-layer").hide();
		hidePopCard();
	});
	
	$("#FILTER_TOGGLE").on("click", function(e){
		if(filterTabOpen==false){
			filterTabOpen=true;
			$(".filter-toggle").addClass("filter-toggle-on");
			$(".filter-list").slideDown();
		}else{
			filterTabOpen=false;
			$(".filter-toggle").removeClass("filter-toggle-on");
			$(".filter-list").slideUp();
		}
	});


	$(".filter-list ul li").on("click", function(e){
		if(filterAct==false && (!$(this).hasClass("on"))){
			filterAct = true;	
			var filterCode = $(this).find("em").html();
			$(".hidden-status .value").html(filterCode);
			$(".filter-toggle-button").addClass("filter-toggle-button-selected");
			getFilterdCard(filterCode);
		}
	});

	$(".hidden-status .user-select").on("click", function(e){
		if(filterAct==true){
			filterAct = false;
			resolveFocusing();
		}
	});

	$(".section-body").delegate(".filter-exit", "click", function(e){
		if(filterAct==true){
			filterAct = false;
		}else if(relAct==true){
			relAct = false;
		}
		resolveFocusing();
	});

	var filterdItem;
	var relItem;
	$(".section-body").delegate(".arr-up", "click", function(e){
		var f_i = $(this).parent(".filter-card-navi").parent(".timeline-el").attr("data-focus-index");
		if(f_i !== 0){
			if(filterAct==true){
				var movePos = filteredCardPos[Number(f_i)-1]-(screenHeight*0.4);
			}else if(relAct ==true){
				var movePos = relCardPos[Number(f_i)-1]-(screenHeight*0.4);
			}
			$("html, body").animate({scrollTop: movePos}, 700, "easeOutCubic");
		}
		
	});

	$(".section-body").delegate(".arr-down", "click", function(e){
		var f_i = $(this).parent(".filter-card-navi").parent(".timeline-el").attr("data-focus-index");
		if(filterAct==true){
			var movePos = filteredCardPos[Number(f_i)+1]-(screenHeight*0.4);
		}else if(relAct ==true){
			var movePos = relCardPos[Number(f_i)+1]-(screenHeight*0.4);
		}
		$("html, body").animate({scrollTop: movePos}, 700, "easeOutCubic");
	});



});

function sendSns(s) {
  var url = encodeURIComponent(location.href),
	  txt = encodeURIComponent($("title").html());
  switch (s) {
    case 'facebook':
      window.open('http://www.facebook.com/sharer/sharer.php?u=' + url);
      break;
    case 'twitter':
      window.open('http://twitter.com/intent/tweet?text=' + txt + '&url=' + url);
      break;
  }
}
