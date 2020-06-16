$(function(){
	var ieTest = false,
		screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		imgURL = "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/",
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
		reSetFrameAni();
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
				return "<div class='hideme timeline-el el-card el-with-img "+id+"'><p class='el-year'><span class='year'></span><span class='spot'></span></p><div class='card-body'><div class='arrow'><img src='http://img.khan.co.kr/spko/storytelling/2020/tracknroom/"+id+".jpg' alt=''></div><div class='card-thumb'><img src='' alt=''><div class='thumb-shade'></div></div><div class='card-text'><p class='card-title'></p><p class='card-desc-point'></p></div><div class='view-card'><p>사건 설명 더보기</p></div></div><div class='card-share'><div class='share_fb'><img src='http://img.khan.co.kr/spko/storytelling/2020/tracknroom/fb_icon_line_w.png' alt='페이스북' /></div><div class='share_tw'><img src='http://img.khan.co.kr/spko/storytelling/2020/tracknroom/tw_icon_line_w.png' alt='트위터' /></div></div></div>";
				break;
			case "simple-card":
				return "<div class='hideme timeline-el el-simple-card el-no-img "+id+"'><p class='el-year'><span class='year'></span><span class='spot'></span></p><div class='card-body'><div class='arrow'><img src='' alt=''></div><div class='card-text'><p class='card-title'></p><p class='card-desc-point'></p></div></div></div>";
				break;
			case "simple":
				return "<div class='hideme timeline-el el-simple "+id+"'><p class='el-year'><span class='year'></span><span class='spot'></span></p><div class='card-body'><div class='card-text'><p class='card-title'></p></div></div></div>";
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


			if(data[d]["shareAble"]!==null && data[d]["shareAble"]=="o"){
				$this_card.addClass("card-shareable");
			}

			if(isMobile==true){
				if(data[d]["line"]=="center"){
					$this_card.find(".arrow").addClass("arrow-up");
				}else if(data[d]["line"]=="right"){
					$this_card.find(".arrow").addClass("arrow-right");
				}else if(data[d]["line"]=="left"){
					$this_card.find(".arrow").addClass("arrow-left");
				}
				$this_card.find(".arrow img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/arrow-up.png");

			}else{
				if(data[d]["line"]=="center"){
					$this_card.find(".arrow").addClass("arrow-up");
					$this_card.find(".arrow img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/arrow-up.png");
				}else if(data[d]["line"]=="right"){
					$this_card.find(".arrow").addClass("arrow-right");
					$this_card.find(".arrow img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/arrow-right-2.png");
				}else if(data[d]["line"]=="left"){
					$this_card.find(".arrow").addClass("arrow-left");
					$this_card.find(".arrow img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/arrow-left-2.png");
				}
			}		

			if( (data[d]["pointTxt"]!==null )&&$this_card.find(".card-desc-point").length){
				$this_card.find(".card-desc-point").html(data[d]["pointTxt"]);
			}

			if( (data[d]["thumb"]!==null )&&$this_card.find(".card-thumb").length){
				$this_card.find(".card-thumb img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/"+data[d]["id"]+".jpg");
			}

			if(data[d]["relCode"] !== null ){
				$this_card.append("<div class='show-rel-card'><div class='rel-icon'><img src='http://img.khan.co.kr/spko/storytelling/2020/tracknroom/rel-icon-2.png' alt='관련사건타래보기'><span class='icon-desc'>사건 타래 보기</span></div></div>");
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
				//console.log(sec_item.length);
				var last_item_pos = Number(sec_item.eq(sec_item.length-1).css("top").replace("px",""));
				temH = last_item_pos + sec_item.eq(sec_item.length-1).height() + item_margin;
				//console.log(temH);
				$(item).find(".section-body").css({"height":temH+"px"});
			}
		})	
		getTimelineHeight();
	};

	function addCardNavi(){
		var exitIcon = (isMobile==true)? "exit-icon-b-2" : "exit-icon-or-big";
		$(".timeline-el").each(function(index,item){
			$(item).append("<div class='filter-card-navi'><div class='arr-up'><img src='http://img.khan.co.kr/spko/storytelling/2020/tracknroom/arr-up-or-bold.png' alt='필터링사건안에서이동'></div><div class='arr-down'><img src='http://img.khan.co.kr/spko/storytelling/2020/tracknroom/arr-down-or-bold.png' alt='필터링사건안에서이동'></div><div class='filter-exit'><img src='http://img.khan.co.kr/spko/storytelling/2020/tracknroom/"+exitIcon+".png' alt='필터링끄기'></div><div class='arr-info'><span class='f_i'></span><span class='slash'>/</span><span class='total'></span></div></div>");
		});
	};

	function addCardSvg(){
		$(".timeline-el").each(function(index,item){
			if($(item).hasClass("el-with-rel")){
				$(item).append("<svg id='svg-"+$(item).attr("data-id")+"'></svg>");
			}
		});

		var pathS1e1 = document.getElementById("svg-s1-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS1e2 = document.getElementById("svg-s1-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS3e1 = document.getElementById("svg-s3-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS3e2 = document.getElementById("svg-s3-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS3e4 = document.getElementById("svg-s3-e4").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS3e3 = document.getElementById("svg-s3-e3").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS4e1 = document.getElementById("svg-s4-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS4e5 = document.getElementById("svg-s4-e5").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS4e4 = document.getElementById("svg-s4-e4").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS5e2 = document.getElementById("svg-s5-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS6e2 = document.getElementById("svg-s6-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS6e4 = document.getElementById("svg-s6-e4").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS7e2 = document.getElementById("svg-s7-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS8e5 = document.getElementById("svg-s8-e5").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS8e7 = document.getElementById("svg-s8-e7").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS8e9 = document.getElementById("svg-s8-e9").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS10e1 = document.getElementById("svg-s10-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS10e3 = document.getElementById("svg-s10-e3").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS10e4 = document.getElementById("svg-s10-e4").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS11e5 = document.getElementById("svg-s11-e5").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS11e6 = document.getElementById("svg-s11-e6").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS12e2 = document.getElementById("svg-s12-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS13e1 = document.getElementById("svg-s13-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS13e2 = document.getElementById("svg-s13-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS13e3 = document.getElementById("svg-s13-e3").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS13e12 = document.getElementById("svg-s13-e12").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS13e6 = document.getElementById("svg-s13-e6").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS13e7 = document.getElementById("svg-s13-e7").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS13e13 = document.getElementById("svg-s13-e13").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS14e1 = document.getElementById("svg-s14-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS14e2 = document.getElementById("svg-s14-e2").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS14e5 = document.getElementById("svg-s14-e5").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS14e6 = document.getElementById("svg-s14-e6").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS14e8 = document.getElementById("svg-s14-e8").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS14e11 = document.getElementById("svg-s14-e11").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		var pathS15e1 = document.getElementById("svg-s15-e1").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));	
		

		if(!isMobile){
			pathS1e1.setAttributeNS(null,"d","M0,0 Q200,600 0,4000");
			pathS1e2.setAttributeNS(null,"d","M-100,0 Q00,500 -400,1900");
			pathS3e1.setAttributeNS(null,"d","M300,0 Q-500,5000 400,21150");
			pathS3e2.setAttributeNS(null,"d","M0,0 Q-100,250 0,400");
			pathS3e4.setAttributeNS(null,"d","M0,0 Q500,500 350,1000");
			pathS3e3.setAttributeNS(null,"d","M0,0 Q-100,700 100,1600");
			pathS4e1.setAttributeNS(null,"d","M200,0 Q-100,100 -30,200");
			pathS4e5.setAttributeNS(null,"d","M200,0 Q500,500 550,2300");
			pathS4e4.setAttributeNS(null,"d","M120,0 Q600,4000 50,6650");
			pathS5e2.setAttributeNS(null,"d","M0,0 Q600,250 350,700");
			pathS6e2.setAttributeNS(null,"d","M0,0 Q-400,4500 120,5900");
			pathS6e4.setAttributeNS(null,"d","M0,0 Q-400,6500 200,8200");
			pathS7e2.setAttributeNS(null,"d","M0,0 Q-300,1700 350,2800");
			pathS8e5.setAttributeNS(null,"d","M50,0 Q-300,3000 400,4500");
			pathS8e7.setAttributeNS(null,"d","M100,0 Q1000,3000 50,9000");
			pathS8e9.setAttributeNS(null,"d","M50,0 Q-100,2000 600,3100");
			pathS10e1.setAttributeNS(null,"d","M100,0 Q500,600 300,1100");
			pathS10e3.setAttributeNS(null,"d","M250,0 Q-200,2500 600,6300");
			pathS10e4.setAttributeNS(null,"d","M50,0 Q-500,3000 300,7000");
			pathS11e5.setAttributeNS(null,"d","M300,0 Q320,50 350,90");
			pathS11e6.setAttributeNS(null,"d","M50,0 Q500,2000 0,8900");
			pathS12e2.setAttributeNS(null,"d","M0,0 Q600,1200 400,2020");
			pathS13e1.setAttributeNS(null,"d","M250,0 Q-100,2000 500,4150");
			pathS13e2.setAttributeNS(null,"d","M50,0 Q-200,3000 400,4950");
			pathS13e3.setAttributeNS(null,"d","M50,0 Q-200,3000 700,3500");
			pathS13e6.setAttributeNS(null,"d","M50,0 Q-300,600 250,1220");
			pathS13e7.setAttributeNS(null,"d","M50,0 Q-100,2500 420,3300");
			pathS13e12.setAttributeNS(null,"d","M150,0 Q400,1200 0,2500");
			pathS13e13.setAttributeNS(null,"d","M100,0 Q600,1000 50,1950");
			pathS14e1.setAttributeNS(null,"d","M100,0 Q-100,1500 450,3150");		
			pathS14e2.setAttributeNS(null,"d","M100,0 Q300,900 500,1780");
			pathS14e5.setAttributeNS(null,"d","M80,0 Q200,500 100,1900");
			pathS14e6.setAttributeNS(null,"d","M160,0 Q-100,500 100,2950");	
			pathS14e8.setAttributeNS(null,"d","M300,0 Q-100,900 600,1920");
			pathS14e11.setAttributeNS(null,"d","M220,0 Q400,1200 300,1550");
			pathS15e1.setAttributeNS(null,"d","M200,0 Q350,300 300,400");		
		}else if(isMobile==true){
			pathS1e1.setAttributeNS(null,"d","M100,0 Q400,1000 200,3200");
			pathS1e2.setAttributeNS(null,"d","M50,0 Q00,500 150,1400");
			pathS3e1.setAttributeNS(null,"d","M200,0 Q700,8500 180,17300");
			pathS3e2.setAttributeNS(null,"d","M50,0 Q-100,250 30,350");
			pathS3e4.setAttributeNS(null,"d","M0,0 Q200,500 250,900");
			pathS3e3.setAttributeNS(null,"d","M0,0 Q-100,700 150,1400");
			pathS4e4.setAttributeNS(null,"d","M140,0 Q600,2000 150,5200");
			pathS4e1.setAttributeNS(null,"d","M200,0 Q100,51 50,150");
			pathS4e5.setAttributeNS(null,"d","M100,0 Q-100,500 250,1900");
			pathS5e2.setAttributeNS(null,"d","M150,0 Q350,150 300,500");
			pathS6e2.setAttributeNS(null,"d","M50,0 Q-150,2500 100,4700");
			pathS6e4.setAttributeNS(null,"d","M100,0 Q-200,6500 200,6600");
			pathS7e2.setAttributeNS(null,"d","M0,0 Q-100,1700 150,2300");
			pathS8e5.setAttributeNS(null,"d","M100,0 Q-100,3000 250,3650");
			pathS8e7.setAttributeNS(null,"d","M100,0 Q550,2000 150,7250");
			pathS8e9.setAttributeNS(null,"d","M50,0 Q-100,1000 300,2400");
			pathS10e1.setAttributeNS(null,"d","M100,0 Q250,600 250,700");
			pathS10e3.setAttributeNS(null,"d","M100,0 Q-100,2500 200,5000");
			pathS10e4.setAttributeNS(null,"d","M100,0 Q-100,3000 250,5650");
			pathS11e5.setAttributeNS(null,"d","M230,0 Q300,100 220,130");
			pathS11e6.setAttributeNS(null,"d","M70,0 Q-300,500 0,7500");
			pathS12e2.setAttributeNS(null,"d","M150,0 Q400,700 100,1500");
			pathS13e1.setAttributeNS(null,"d","M150,0 Q-200,2000 250,3280");
			pathS13e2.setAttributeNS(null,"d","M50,0 Q-200,3000 300,4250");
			pathS13e3.setAttributeNS(null,"d","M150,0 Q-100,1000 260,2830");
			pathS13e6.setAttributeNS(null,"d","M50,0 Q-100,400 150,1100");
			pathS13e7.setAttributeNS(null,"d","M50,0 Q-100,1200 220,2750");
			pathS13e12.setAttributeNS(null,"d","M150,0 Q300,1200 100,2100");
			pathS13e13.setAttributeNS(null,"d","M60,0 Q300,800 50,1600");
			pathS14e1.setAttributeNS(null,"d","M100,0 Q-100,1500 250,2750");
			pathS14e2.setAttributeNS(null,"d","M220,0 Q300,700 200,1520");
			pathS14e5.setAttributeNS(null,"d","M160,0 Q300,500 100,1800");
			pathS14e6.setAttributeNS(null,"d","M140,0 Q-100,500 100,2850");
			pathS14e8.setAttributeNS(null,"d","M150,0 Q-50,500 300,1750");
			pathS14e11.setAttributeNS(null,"d","M160,0 Q-50,1200 200,1500");
		}
	
	};


	function getTimelineHeight(){
		timelineEndPos = $(".timeline-holder").offset().top + $(".timeline-holder").height();
		bubbleSvgPos = $(".sec-title--15").offset().top;
		endTrafficPos = (isMobile==true)?  $(".ending-graphic").offset().top-screenHeight*0.4 : $(".ending-graphic").offset().top;
	};

	/***** 사건 카드 생성 관련 함수들 *****/

	
	/******* bubble traffic  ******/

	function makeCenterForcedBubble(){
		var width = 600, height = 600
		var numNodes = 600
		var nodes = d3.range(numNodes).map(function(d) {
		  return {radius: randomRange(2,3) }
		})

		var simulation = d3.forceSimulation(nodes)
		  .force('charge', d3.forceManyBody().strength(1))
		  .force('center', d3.forceCenter(width / 2, height / 2))
		  .force('collision', d3.forceCollide().radius(function(d) {
			return d.radius
		  }))
		  .on('tick', ticked)
		
		var bubbleSvg = d3.select("#SVG_BUBBLE svg")
					.attr("width", width)
					.attr("height", height);
		var bubbleHolder = bubbleSvg.append("g")
									.attr("class","bubble-holder");

		function ticked() {
		  var u = bubbleHolder
					.selectAll("circle")
					.data(nodes)

		  u.enter()
			.append('circle')
			.attr('r', function(d) {
				return d.radius
			})
			.merge(u)
			.attr('cx', function(d) {
				return d.x
			})
			.attr("fill", function(){
				var t= randomRange(1,3);
				if(t=="1"){
					return "#f86302";
				}else if(t=="2"){
					return "ff2a672";
				}else if(t=="3"){
					return "#ff4200";
				}else{
					return "#f86302";
				}
			})
			.attr('cy', function(d) {
				return d.y
			})
		  u.exit().remove()
		}
	}
	makeCenterForcedBubble();


	function colorCircle(){
		 d3.select("#SVG_BUBBLE svg")
			 .selectAll("circle")
			 .transition()
			 .duration(function() {
				return Math.floor(Math.random() * 2000)
			 }).style("fill-opacity",function(){
				var r = randomRange(30,100);
				return r/100;
			}).style("fill", function(){
				var t= randomRange(1,3);
				if(t=="1"){
					return "#f86302";
				}else if(t=="2"){
					return "#de1500";
				}else if(t=="3"){
					return "#ff4200";
				}else{
					return "#ff8352";
				}
			});
	}
	

	function addtrafficPlots(svgId, pos){
	
		var t_svg = d3.select(svgId);

		var defs = t_svg.append("defs");
		var filter = defs.append("filter")
			.attr("id","glow");

		filter.append("feGaussianBlur")
			.attr("class", "blur")
			.attr("stdDeviation","4.5")
			.attr("result","coloredBlur");

		var feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode")
			.attr("in","coloredBlur");
		feMerge.append("feMergeNode")
			.attr("in","SourceGraphic");


		var bubbleG = t_svg.append("g")
									.attr("class","bubble-g bubble-g--1");

		var bubbleG_random = t_svg.append("g")
									.attr("class","bubble-g bubble-g--random");

		var t_width = $(".bubble-traffic-holder").width();
		var t_height = $(".bubble-traffic-holder").height();

		var trafficNumb = (pos=="end")? 1600: 1200;

		for(i=0; i<trafficNumb; i++){
			var angle = i/30;
			var circle = bubbleG.append("circle")
				.attr("class", "traffic-plots")
				.attr("data-cx", function(){
					if(pos == "end"){
						return Math.cos(angle)*500 + randomRange(-300,300) + t_width/2;
					}else{
						return randomRange(-t_width,t_width);
					}
				}).attr("data-cy", function(){
					if(pos == "end"){
						return Math.sin(angle)*150+ randomRange(-80,80) + t_height/2;
					}else{
						return (randomRange(0, screenHeight * 4));
					}
				}).attr("cx", function(){
					if(pos == "end"){
						return randomRange(-t_width,t_width);
					}else{
						return Math.cos(angle)*500 + randomRange(-300,300) + t_width/2;
					}
				}).attr("cy", function(){
					if(pos == "end"){
						return -(randomRange(0, screenHeight * 3));
					}else{
						return Math.sin(angle)*150+ randomRange(-80,80) + t_height/2;
					}
				}).attr("r", function(){
					return randomRange(2, 3);
				}).style("fill-opacity",function(){
					if(pos == "end"){
						var r = randomRange(0,10);
					}else{
						var r = randomRange(70,100);
					}
					return r/100;
				}).style("fill", function(){
					var t= randomRange(1,3);
					if(t=="1"){
						return "#ff7826";
					}else if(t=="2"){
						return "#de1500";
					}else if(t=="3"){
						return "#ff4200";
					}else{
						return "#ff8352";
					}
				});
		}
		for(i=0; i<300; i++){
			var circle = bubbleG_random.append("circle")
				.attr("class", "traffic-plots")
				.attr("data-cx", function(){
					return randomRange(-t_width*1.5, t_width*1.5);
				}).attr("data-cy", function(){
					return randomRange(-t_height*0.2, t_height*1.2);
				})
				.attr("cx", function(){
					return randomRange(-t_width,t_width);
				}).attr("cy", function(){
					if(pos == "end"){
						return -(randomRange(0, screenHeight * 2.5));
					}else{
						return (randomRange(0, 500));
					}
				}).attr("r", function(){
					return randomRange(1, 3);
				}).style("fill-opacity",function(){
					if(pos == "end"){
						var r = randomRange(0,10);
					}else{
						var r = randomRange(30,60);
					}
					return r/100;
				}).style("fill", function(){
					var t= randomRange(1,3);
					if(t=="1"){
						return "#f86302";
					}else if(t=="2"){
						return "#de1500";
					}else if(t=="3"){
						return "#ff4200";
					}else{
						return "#ff8352";
					}
				})
		}

	}
	addtrafficPlots("#INTRO_TRAFFIC", "intro");
	addtrafficPlots("#END_TRAFFIC", "end");

	function positioningPlots(svgId, pos){
		if(pos=="end"){
			var plots = d3.selectAll("#END_TRAFFIC .traffic-plots");
		}else{
			var plots = d3.selectAll("#INTRO_TRAFFIC .traffic-plots");
		}
		plots.transition()
				.duration(function() {
					return randomRange(2000, 7000);
				})
				.ease(d3.easeQuadInOut)
				.attr("cx", function(){
					return d3.select(this).attr("data-cx");
				}).attr("cy", function(){
					return d3.select(this).attr("data-cy");
				}).style("fill-opacity",function(){
					if(pos=="end"){
						var r = randomRange(70,100);
						return r/100;
					}else{
						return 0;
					}
				});

		setTimeout(function() {
			if(pos=="end"){
				afterPosition();
				$("body").removeClass("fixed");
			}else{
			
			}

		}, 3000);
	};

	function afterPosition(){
		$(".bubble-traffic-holder .img-back").fadeIn(1000, function(){
			for(f=0; f< $(".traffic-nroom").length;f++){
				$(".bubble-traffic-holder .img-front .traffic-front").eq(f).delay(300*f).fadeIn(1000);
				$(".traffic-nroom").eq(f).delay(300*f).fadeIn(1000);
			}
		});
	};

	/******* bubble traffic  ******/

	/***사건 팝업카드 관련**/
	function makePopCard(cardId){
		var selectItemData;
		for(c=0;c<cardData.length;c++){
			if(cardData[c]["id"] == cardId){
				selectItemData = cardData[c];
				break;
			}
		}
		//console.log(selectItemData);
		$(".popUp-front").find(".year").html(selectItemData["ymd"]);
		$(".popUp-front").find(".thumb-holder img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/"+selectItemData["thumb"]+".jpg");
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
		$("body").removeClass("fixed");
		scrollAble = true;
		makeScrollAble();
		$(window).scrollTop(lastBodyScroll);
	}

	function fadeInPopCard(){
		$(".popUp-layer").show();
		$(".popUp-body .popUp-card-full-text").scrollTop(0);
		$(".popUp-body .body-scroll").scrollTop(0);
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
		focusingCard(relCardIdArr, true);
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
		//$("html, body").animate({scrollTop: firstRelItemPos}, 700, "easeOutCubic");
		makeFilterToggleUnable();
		if( !isMobile ){ $(".fixed-focus-item-list").fadeIn() };
	};


	function focusingCard(arr, t){
		$(".timeline-el").addClass("timeline-el-off");
		$(".sec-title").addClass("sec-title-off");
		$("#SVG_BUBBLE").addClass("svg-bubble-off");
		$(".line-body-end").addClass("line-body-end-off");

		for(a=0; a<arr.length;a++){
			if(t==true){
				$("."+arr[a]).addClass("timeline-el-focus");
			}else if(t==false){
				$("."+arr[a]).addClass("timeline-el-focus timeline-el-noPath");
			}
			$("."+arr[a]).attr("data-focus-index", a);
			$("."+arr[a]).find(".f_i").html(a+1);
			$("."+arr[a]).find(".total").html(arr.length);
		};
		$(".timeline-el-focus").find(".arr-up").show();
		$(".timeline-el-focus").find(".arr-down").show();
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
		//console.log(tag);
		var filteredCardIdArr = new Array;
		for(c=0;c<cardData.length;c++){
			if(  cardData[c]["tag"] !== null && cardData[c]["tag"].indexOf(tag) !== -1 ){
				filteredCardIdArr.push(cardData[c]["id"]);
			}
		}

		focusingCard(filteredCardIdArr, false);
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
		$(".timeline-el").removeClass("timeline-el-off timeline-el-focus timeline-el-noPath");
		$(".timeline-el").removeAttr("data-focus-index");
		$(".sec-title").removeClass("sec-title-off");
		$("#SVG_BUBBLE").removeClass("svg-bubble-off");
		$(".line-body-end").removeClass("line-body-end-off");

		$(".fixed-focus-item-list").hide();
		$(".filter-toggle-button").removeClass("filter-toggle-button-selected");
		makeFilterToggleAble();
	};
	/**** 카드 필터링 관련 함수들 ***/

	function clearFrameAni(){
		clearInterval(itemBlinkingRepeat);
	}
	
	function reSetFrameAni(ob){
		
		$(".top-graphic-device img").css("width", $(".top-graphic-device").width()*2);
		makeFrameAni($(".top-graphic-device img"), 600);
	}
	var itemBlinkingRepeat;
	// 2 cut frame Animation
	function makeFrameAni(ob, time){
		clearFrameAni();
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
		itemBlinkingRepeat = setInterval( function(){ itemBlinking() }, time*2);
	};
	makeFrameAni($(".top-graphic-device img"), 600);		


	/******** 모바일 전용 조정 ********/
	if(isMobile==true){		
		$(".sec--5 .sec-title .img-title img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/sec-title-05-m.png");
		$(".sec--7 .sec-title .img-title img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/sec-title-07-m.png");
		$(".sec--8 .sec-title .img-title img").attr("src", "http://img.khan.co.kr/spko/storytelling/2020/tracknroom/sec-title-08-m.png");
		$(".video-boxing iframe").css({"width":$(".blank img").width(),"height":$(".blank img").height()});

	}else { 
		var adjValue = (($(".story-header").height()-$(".story-header-front").height())/2)-40;
		$(".story-header-front").css({"top":adjValue+"px"});
		setFilterToggleDefault();
	
	}
	/******** 모바일 전용 조정 ********/

	/******** init page ********/

	function init(){
		makeSectionCard();
		hidePopCard();
		$(".story-header-front").fadeIn(1000);
	}

	$(".loading-page").fadeOut(200, function(){
		init();
	});
	/******** init page ********/

	/******** Scroll event listener ********/
	var nowScroll;
	var timeWarpDone = false; 
	var timeWarpPoint = (isMobile==true)? ($(".time-warp").offset().top-(screenHeight*0.3)) : ($(".time-warp").offset().top-(screenHeight*0.2));
	var warpPos = timeWarpPoint;
	var timelineStartPos = $(".timeline-holder").offset().top,
		timelineEndPos = 0; 
	
	function animateTimeWarp(){
		 timeWarpDone=true;
		// animateValue("YEAR_COUNTING", 2020, 1953, 2000);
		 positioningPlots("INTRO_TRAFFIC", "intro");
		 setTimeout(function() {
			$("body").removeClass("fixed");
			scrollAble = true;
			makeScrollAble();
			$(".top-timewarp-graphic .center-display").fadeOut(1000);
			$(".time-warp").addClass("time-warp-after");
			$("#YEAR_COUNTING").animate({"opacity":"1"}, 1500);
			$(".timeline-area").animate({"opacity":"1"}, 1500, function(){
				$("#INTRO_TRAFFIC").html("");
			});
		 }, 3000);


	};
	

	var bubbleColorAnimate = false;
	var bubbleSvgPos;
	
	var endTrafficAnimate = false;
	var endTrafficPos; 
	var scrollAble = true; 

	function scrollDisable(){
		$("body").addClass("scrollDisable").on("scroll touchmove mousewheel", function(e){
			e.preventDefault();
		});
	}
	function makeScrollAble(){
		$("body").removeClass("scrollDisable").off("scroll touchmove mousewheel");
	}

	$(window).scroll(function(e){
		var nowScroll = $(window).scrollTop();
		if(scrollAble==false){
			e.preventDefault();
			e.stopPropagation();
			return false;
		}else{
			var timelineScroll = nowScroll-timelineStartPos+screenHeight,
			timelinefullScroll = $(".timeline-holder").height(),	
			ScrollPer = (timelineScroll/timelinefullScroll)*100;

			if(nowScroll >timeWarpPoint&&timeWarpDone==false){
				$("body").addClass("fixed");
				//scrollDisable();
				scrollAble = false;
				$("html, body").animate({scrollTop: warpPos}, 700, "easeOutCubic", function(){
					if(	timeWarpDone==false){
						animateTimeWarp();
					}
				});
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
			
			if(nowScroll > bubbleSvgPos && bubbleColorAnimate==false){
				bubbleColorAnimate = true;
				colorCircle();
			}

			if(nowScroll+screenHeight > endTrafficPos &&  endTrafficAnimate==false){
				endTrafficAnimate = true;
				console.log("END_TRAFFIC");
				positioningPlots("END_TRAFFIC", "end")
				$(".ending-graphic .center-display").fadeIn();
				
			}

			$(".hideme").each(function(i){
				if( nowScroll + screenHeight > $(this).offset().top + $(this).outerHeight()*0.5 ){
					$(this).stop().animate({"opacity":"1"},1000);
				}
			});
		
		}
		

	});

	$(".popUp-body .body-scroll").scroll(function(e){
		e.stopPropagation();
		e.preventDefault();
	});
	/******** Scroll event listener ********/

	var filterTabOpen = false,
		filterAct = false,
		filteredCardIndex = new Array,
		filteredCardPos = new Array,
		lastBodyScroll = 0;

	$(".timeline-holder").delegate(".el-card .card-body", "mouseover", function(e){
		if(!isMobile){
			$(this).addClass("card-body-hover");
		}
	}).delegate(".el-card .card-body", "mouseout", function(){
		$(this).removeClass("card-body-hover");
	}).delegate(".el-card .card-body", "click", function(e){
		var thisCardId = $(this).parent(".timeline-el").attr("data-id");
		lastBodyScroll = $(window).scrollTop();
		console.log("body scroll pos: "+lastBodyScroll);
		$("body").addClass("fixed");
		scrollAble = false;
		scrollDisable();
		makePopCard(thisCardId);
	});

	$("#CARD_CLOSE_BTN, .popUp-back, .m-close").on("click", function(){
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

	function setFilterToggleDefault(){
		filterTabOpen=true;
		$(".filter-toggle").addClass("filter-toggle-on");
		$(".filter-list").slideDown();
	};	

	$(".filter-list ul li em").on("click", function(e){
		if(filterAct==false && (!$(this).hasClass("on"))){
			filterAct = true;	
			var filterCode = $(this).html();
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


	// 결과 공유하기
   $(".section-body").delegate(".timeline-el .card-share .share_fb", "click", function(e){
		e.preventDefault();
		//var cardId = $(this).parent(".card-share").parent(".timeline-el").attr("data-id").replace("-","_");
		var cardId = $(this).parent(".card-share").parent(".timeline-el").attr("data-id");
		//console.log(cardId);
		var url = encodeURIComponent("http://news.khan.co.kr/kh_storytelling/2020/tracknroom/result.html?cardId=" + cardId + "&fbrefresh=NOT_SEEN_BEFORE");
		window.open('http://www.facebook.com/sharer/sharer.php?u=' + url);
		return false;
    });

    $(".section-body").delegate(".timeline-el .card-share .share_tw","click", function(e){
		e.preventDefault();
		var cardId = $(this).parent(".card-share").parent(".timeline-el").attr("data-id");
		//console.log(cardId);
		var url = encodeURIComponent("http://news.khan.co.kr/kh_storytelling/2020/tracknroom/result.html?cardId=" + cardId);
		window.open('http://twitter.com/intent/tweet?url=' + url);
		return false;
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
