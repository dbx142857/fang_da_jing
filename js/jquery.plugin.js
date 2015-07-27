/*
 * 1)-------->tpl------------------------------------简单的模板引擎
 * 2)-------->module------------------------------------简单的模块处理
 */
(function($) {
	$.extend({

		/*
		 * demos:
		 * var data={
			0:{
				str:"fucku00000000",
				str1:{
					sub:"hello00000000"
				}
			}
			,1:{
				str:"fucku1111111111",
				str1:{
					sub:"hello111111111"
				}
			}
		};
		var $div=$("div").appendTo($("body"));
		for(var i in data)
		{
			var str=$.tpl({
				tpl:[
					"<div>{{str}}1111111111111111{{str}}2222{{str1.sub}}</div>"
					,"<div>{{str}}1111111111111111{{str}}2222{{str1.sub}}</div>"
					].join(""),
				data:data[i]
			});
			$(str).appendTo($div)
		}
		 */

		tpl : function(options) {
			options = $.extend({
				left_split : "{{",
				right_split : "}}",
				tpl : "",
				data : null
			}, options);
			if (options.data == null) {
				return options.tpl;
			} else {
				var reg = new RegExp(options.left_split + "(.+?)" + options.right_split, "gi");
				var strs = options.tpl.match(reg), tpl = options.tpl;
				for (var i = 0; i < strs.length; i++) {
					var str = strs[i];
					strs[i] = str.substring(options.left_split.length, str.length - (options.right_split.length));
					tpl = tpl.replace(str, str.indexOf(".") == -1 ? (options.data[strs[i]]) : (eval("options.data." + strs[i])));
				}
				return tpl;
			}
		},

		/*docs:
		 *
		 * 模块分割，以每个模块中init为入口方法
		 * !!!仅仅支持jquery中可以delegate的时间
		 * module中键名不可以相同

		 * $C:视图容器，不声明则默认$("body")
		 *
		 * E:事件集合{
		 * 	k={
		 * 	最后一个参数表示参与事件的对象：{
		 * 	若存在->，则->之前的selector表示delegate中的父元素，->之后的selector表示被delegate的元素
		 * }
		 * 最后一个参数之前表示事件的类型：{
		 * 	若不存在：，则改事件触发时立即执行函数，否则将等待：之后设置的时间之后再执行函数
		 * }
		 * }
		 */
		/*
		 * demos:
		 * $.module({
			test1:{
				msg:"hello"
				,E:{
					"click:1000 #div0":function($thi){
						console.log("div clicked")
						$thi.html("dsfsdf")
					}
					,"click mouseenter:1000 .div0->input[type=button],textarea":function($thi){
						console.log("button clicked");
					}
					,"paste:1000 textarea":function($thi){
						$thi.val("i am pasteed")
					}
					,"resize window":function($thi){
						console.log("window resized1")
					}
					,"resize:30 window":function($thi){
						console.log("window resized2")
					}
					,"resize:1000 window":function($thi){
						console.log("window resized3")
					}
					
				}
				,init:function()
				{
					$("<input type='button' value='123e'/>").appendTo($("body"));
					$("<input type='button' value='123e'/>").appendTo($("#div0"));
					$("<textarea>").appendTo($("#div0"));
					$("<textarea>").appendTo($("body"));
				}
			}
		})
		 */
		module : function(json) {
			for (var i in json) {
				var item = json[i];
				var $C = item.$C || $("body");
				item.$C = $C;
				if (item.E) {
					var e = item.E;
					for (var j in e) {
						var fn = e[j];
						var arr = j.split(" "), arr_len = arr.length, ele = arr[arr_len - 1], $parent, childs;
						if (ele.indexOf("->") == -1) {
							$parent = $C;
							childs = ele;
						} else {
							obj_arr = ele.split("->");
							$parent = $(obj_arr[0]);
							childs = obj_arr[1];
						}
						var e_types = arr.splice(0, arr_len - 1);
						for (var q in e_types) {
							var e_type = e_types[q], mao_hao_index = e_type.indexOf(":");
							if (childs!="window") {
								if (mao_hao_index == -1) {
									$parent.delegate(childs, e_type, (function(fn) {
										return function() {
											fn($(this));
										}
									})(fn))
								} else {
									var e_type_arr = e_type.split(":");
									$parent.delegate(childs, e_type_arr[0], (function(fn,dealy) {
										return function() {
											var $thi = $(this);
											setTimeout(function() {
												fn($thi);
											}, dealy);
										}
									})(fn,e_type_arr[1]))
								}
							}
							else
							{
								if (mao_hao_index == -1) {
										$(window).on(e_type,(function(fn) {
										return function() {
											var $thi = $(this);
											fn($thi)
										}
									})(fn))
								} else {
									var e_type_arr = e_type.split(":");
									$(window).on(e_type_arr[0],(function(fn,dealy) {
										return function() {
											var $thi = $(this);
											setTimeout(function() {
												fn($thi);
											}, dealy);
										}
									})(fn,e_type_arr[1]))
								}
							}
						}
					}
				}

				for (var j in item) {
					if (j == "init") {
						item[j]();
					}
				}

			}
			return $;
		}
	})
})(jQuery);
