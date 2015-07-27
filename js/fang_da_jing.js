



(function($){
	$.fn.extend({
		set_pos:function(){
			var $thi=$(this),pos=$thi.css("position");
			if(pos=="static"){
				$thi.css({
					position:"relative"
				})
			}
			return $thi;
		}
		,fang_da_jing:function(options){
			var $thi=$(this)
				,zoom=null,
				tar_l,//放大镜的圆心位置所应该重合的坐标点的横坐标（远点为图像左上角位置）
				tar_t,//放大镜的圆心位置所应该重合的坐标点的纵坐标（远点为图像左上角位置）
				bg_l,//放大镜内北京的x偏移
				bg_t,//放大镜内北京的y偏移
				w,//原图的宽度
				h,//原图的高度
				fdj_w,//放大镜的宽
				fdj_h,//放大镜的高
				thi_ol,//图片对象的offset left
				thi_ot,//图片对象的offset top
				$fdj,//放大镜对象
				cmds={
					//保存命令集合数据
				set_cmds:function(){
					$thi.data(options.cmds_data_id,cmds);
				}
				//获取命令集合
				,cmds:function(){
					return $thi.data(options.cmds_data_id);
				}
				//第一次载入图片执行动作
				,init_img:function(){
					zoom=w/$thi.width();
						$thi.css({
							height:h/zoom+"px"
						})
						$("<img>")
							.attr({
								src:options.src
							})
							.css({
								width:"100%",
								height:"100%"
							})
							.appendTo($thi)
				}
				//改变放大镜尺寸
				,resize_fdj_size:function(){
					$thi.find($("."+options.classes.fang_da_jing)).css({
						width:options.size+"px"
						,height:options.size+"px"
					})
					if(options.use_circle==true)
					{
						$thi.find($("."+options.classes.fang_da_jing)).css({
							borderRadius:options.size+"px"
						})
					}
				}
				//重新渲染放大镜bg_pos
				,
				render_fdj_pos:function(){
					var the_css={
						left:tar_l-(fdj_w/2)+"px"
							,top:tar_t-(fdj_h/2)+"px"
							,backgroundPosition:bg_l+"px "+bg_t+"px"
					}
					$thi.find($("."+options.classes.fang_da_jing))
						.css(the_css);
				}
				//相应鼠标移动的事件
				,do_it_when_mousemove:function(e){
					var px=e.pageX,
						py=e.pageY;
						tar_l=px-thi_ol;
						tar_t=py-thi_ot;
						bg_l=-zoom*tar_l+options.size/2;
						bg_t=-(tar_t)*zoom+options.size/2;
						this.render_fdj_pos();
						$thi.find($("."+options.classes.fang_da_jing)).show().fadeIn(0);
				}
				//在尺寸改变时再次加载$obj.fangd_da_jing方法以重新渲染放大镜
				,re_render_fdj:function(e){
					var x=e.pageX,y=e.pageY;
					$thi.html("").fang_da_jing(options)
						$thi.find($("."+options.classes.fang_da_jing)).css({
							left:x-options.size/2-thi_ol+"px",
							top:y-options.size/2-thi_ot+"px"
						})
						.fadeIn(0)
					cmds.set_cmds();
				}
				//根据e.page信息从根本上刷新放大镜的尺寸
				,refresh_fdj_size:function(e,if_fang_da){
					if($thi.find($("."+options.classes.fang_da_jing)).is(":visible"))
					{
						//不指定是否放大或者缩小则根据鼠标滚轮情况进行判断
						if(arguments.length==1){
							var e=e?e:window.event,
								value;
							if(e.wheelDelta){
								value=e.wheelDelta; 
							}else if(e.detail){
								value=e.detail; 
							}
							if_fang_da=value>0?true:false;
						}
						
						if(if_fang_da==true){
							options.size+=parseInt(options.size_change_step);
							if(options.size>options.max_size)
							{
								options.size=options.max_size;
							}
							this.re_render_fdj(e);
						}
						else
						{
							options.size-=options.size_change_step;
							if(options.size<options.min_size)
							{
								options.size=options.min_size;
							}
							this.re_render_fdj(e);
						}
						this.resize_fdj_size();
						this.do_it_when_mousemove(e);
						return false;
					}
				}
			},
			init=function(){
				cmds.set_cmds();
				$thi
				.set_pos()
				.css({
					cursor:"none"
					,overflow:"hidden"
				})
				if(!options.w)
				{
					$("<img>")
					.attr("src",options.src)
					.on("load",function(){
						w=options.w=this.width;
						h=options.h=this.height;
						cmds.init_img();
					})
				}
				else
				{
					w=options.w;
					h=options.h;
					cmds.init_img();
				}
				$fdj=$("<div>")
					.addClass(options.classes.fang_da_jing)
					.css({
						cursor:"none"
					})
					.appendTo($thi);
				$fdj.css({
						zIndex:'10'
						,position:"absolute"
						,backgroundImage:"url("+options.src+")"
					})
					.css("background-repeat","no-repeat")
					.fadeOut(0);
				cmds.resize_fdj_size();
				var thi_offset=$thi.offset();
				fdj_w=$fdj.width();
				fdj_h=$fdj.height();
				thi_ol=thi_offset.left,
				thi_ot=thi_offset.top;
				$thi
				.unbind()
				.bind("mouseenter",function(){
					$fdj.stop().fadeIn("fast").show();
				})
				.bind("mouseleave",function(){
					$fdj.stop().fadeOut("fast");
				})
				.bind("mousemove",function(e){
					e=e?e:window.event;
					if(zoom!=null)
					{
						cmds.do_it_when_mousemove(e);
					}
				})
				if(options.allow_use_mousewheel==true)
				{
					$thi.get(0).onmousewheel=function(e){
						cmds.refresh_fdj_size(e);
					}
				}
			};
			
			//var plugin_id="fang_da_jing";//被绑定的事件后缀
			options=$.extend({
					src:null
					,use_circle:true
					,size:100
					,max_size:$thi.width()
					,size_change_step:10//放大镜尺寸更新步长
					,min_size:50
					,cmds_data_id:"fang_da_jing_cmd_data"
					,classes:{
						fang_da_jing:"fang_da_jing"//放大镜所使用的样式
					}
					,allow_use_mousewheel:true//是否允许使用鼠标滚轮
				},options);
				init();
			return cmds;
		}
	})
})(jQuery)
