(function($){
	$.extend({
		tpl:function(options)
		{
			options=$.extend({
				left_split:"{{",
				right_split:"}}",
				tpl:"",
				data:null
			},options);
			if(options.data==null)
			{
				return options.tpl;
			}
			else
			{
				var reg=new RegExp(options.left_split+"(.+?)"+options.right_split,"gi");
				var strs=options.tpl.match(reg),tpl=options.tpl;
				for(var i=0;i<strs.length;i++)
				{
					var str=strs[i];
					strs[i]=str.substring(options.left_split.length,str.length-(options.right_split.length));
					tpl=tpl.replace(str,str.indexOf(".")==-1?(options.data[strs[i]]):(eval("options.data."+strs[i])));
				}
				console.log(tpl)
				return tpl;
			}
		}
	})
})(jQuery);