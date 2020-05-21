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
				return "<div class='timeline-el el-card el-with-img "+id+"'><p class='el-year'><span class='year'></span><span class='spot'></span></p><div class='card-body'><div class='arrow'><img src='img/"+id+".jpg' alt=''></div><div class='card-thumb'><img src='' alt=''><div class='thumb-shade'></div></div><div class='card-text'><p class='card-title'></p><p class='card-desc-point'></p></div><div class='view-card'><p>사건 설명 더보기 +</p></div></div><div class='card-share'><div class='share_fb'><a onclick='sendSns('facebook'); return false;'><img src='img/fb_icon_line_w.png' alt='페이스북' /></a></div><div class='share_tw'><a onclick='sendSns('twitter'); return false;'><img src='img/tw_icon_line_w.png' alt='트위터' /></a></div></div><div class='show-rel-card'><div class='rel-icon'><img src='img/rel-icon-2.png' alt='관련사건타래보기'><span class='icon-desc'>사건 타래 보기</span></div></div></div>";
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
			}
			
			if(d==data.length-1){
				setSectionHeight();
				addCardNavi();
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
		$sec_item.each(function(index,item){
			$(item).append("<div class='filter-card-navi'><div class='arr-up'><img src='img/arr-up-or.png' alt='필터링사건안에서이동'></div><div class='arr-down'><img src='img/arr-down-or.png' alt='필터링사건안에서이동'></div><div class='filter-exit'><img src='img/exit-icon-or.png' alt='필터링끄기'></div><div class='arr-info'><span class='f_i'></span><span class='slash'>/</span><span class='total'></span></div></div>");
		});
	};

	function getTimelineHeight(){
		timelineEndPos = $(".timeline-holder").offset().top + $(".timeline-holder").height();
	};

	/***** 사건 카드 생성 관련 함수들 *****/


	
	function makePopCard(){

	};

	function hidePopCard(){
		$(".popUp-front").css({"top":"100px", "opacity":"0"});
	}



	/**** 카드 필터링 관련 함수들 ***/
	function focusingFilterdCard(arr){
		$sec_item.addClass("timeline-el-off");
		$sec_title.addClass("sec-title-off");
		for(a=0; a<arr.length;a++){
			$sec_item.eq(arr[a]).addClass("timeline-el-focus");
			$sec_item.eq(arr[a]).attr("data-focus-index", a);
			$sec_item.eq(arr[a]).find(".f_i").html(a+1);
			$sec_item.eq(arr[a]).find(".total").html(arr.length);
		}
		$(".timeline-el-focus").eq(0).find(".arr-up").hide();
		$(".timeline-el-focus").eq(arr.length-1).find(".arr-down").hide();


	};
	
	function getFilterdCard(){
		filteredCardIndex = [];
		
		// 필터링 되야하는 카드의 인덱스 값
		filteredCardIndex.push(0);
		filteredCardIndex.push(5);
		filteredCardIndex.push(8);
		filteredCardIndex.push(20);

		focusingFilterdCard( filteredCardIndex );
		getFilterdCardPos(filteredCardIndex);
	};

	function getFilterdCardPos(arr){
		filteredCardPos = [];
		for(a=0; a<arr.length;a++){
			filteredCardPos.push($sec_item.eq(arr[a]).offset().top);
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


	function resolveFilter(){
		$(".filter-list ul li").removeClass("on");
		$(".filter-list ul li").remove(".exit");
		$sec_item.removeClass("timeline-el-off");
		$sec_item.removeClass("timeline-el-focus");
		$sec_title.removeClass("sec-title-off");
		$sec_item.removeAttr("data-focus-index");
	
	};
	/**** 카드 필터링 관련 함수들 ***/


		

	/******** 모바일 전용 조정 ********/
	if(isMobile==true){
		
	
	}
	/******** 모바일 전용 조정 ********/

	/******** init page ********/
	function init(){
		makeSectionCard();
		hidePopCard();
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
			animateTimeWarp();
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
		filteredCardPos = new Array,
		$sec_item = $(".timeline-el"),
		$sec_title = $(".sec-title");

	$(".timeline-holder").delegate(".el-card .card-body", "mouseover", function(e){
		if(!isMobile){
			$(this).addClass("card-body-hover");
		}
	}).delegate(".el-card .card-body", "mouseout", function(){
		$(this).removeClass("card-body-hover");
	}).delegate(".el-card .card-body", "click", function(){
		$(".popUp-layer").show();
		$(".popUp-front").animate({"top":"0px", "opacity":"1"},400,"easeOutCubic");
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


	$("#FILTER_TEST").on("click", function(e){
		if(filterAct==false && (!$(this).hasClass("on"))){
			filterAct = true;
			$(".filter-list ul li").removeClass("on");
			$(this).addClass("on");
			$(this).append("<span class='exit'></span>");
			getFilterdCard();
		}else if($(this).hasClass("on")){
			filterAct = false;
			resolveFilter();
		}
	});

	$(".section-body").delegate(".filter-exit", "click", function(e){
		if(filterAct==true){
			filterAct = false;
			resolveFilter();	
		}
	});

	var filterdItem;
	$(".section-body").delegate(".arr-up", "click", function(e){
		if(filterAct==true){
			filterdItem = $(".timeline-el-focus");
			var f_i = $(this).parent(".filter-card-navi").parent(".timeline-el").attr("data-focus-index");
			if(f_i ==0){
				
			}else{
				var movePos = filteredCardPos[Number(f_i)-1]-(screenHeight*0.4);
				$("html, body").animate({scrollTop: movePos}, 700, "easeOutCubic");
			}
		}
	});

	$(".section-body").delegate(".arr-down", "click", function(e){
		if(filterAct==true){
			filterdItem = $(".timeline-el-focus");
			var f_i = $(this).parent(".filter-card-navi").parent(".timeline-el").attr("data-focus-index");
			var movePos = filteredCardPos[Number(f_i)+1]-(screenHeight*0.4);
			$("html, body").animate({scrollTop: movePos}, 700, "easeOutCubic");
		}
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
