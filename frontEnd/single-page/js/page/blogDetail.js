/**
 * blog detail
 *
 */
define(function(require,exports){
  var hljs = require('/js/highlight.js');
  var showdown = require('/js/showdown.js'),
      empty_tpl = '<div class="blank-content"><p>博文不存在</p></div>',
      template = __inline('/tpl/blogDetailPage.html');

  function getData(id,fn){
    utils.fetch({
      url : '/ajax/blog',
      data : {
        act : 'get_detail',
        id : id
      },
      callback :function(err,data){
        if(data.code == 200){
          var converter = new showdown.converter(),
              detail = data['detail'];
          detail.content = converter.makeHtml(detail.content);
          detail.time_show = L.parseTime(detail.time_show,'{y}-{mm}-{dd}');
          var this_html = juicer(template,detail);
          fn&&fn(null,this_html,data['detail']['title']);
        }else{
          fn&&fn('博客不存在！');
        }
      }
    });
  };

  return function(dom,id,callback){
    getData(id,function(err,html,title){
      if(err){
        dom.innerHTML = empty_tpl;
        return;
      }
      callback && callback(title);
      if(html){
        dom.innerHTML = html;
      }
      var commentDom = Sizzle('.comments_frame',dom)[0];

      //代码高亮
      utils.each(Sizzle('pre',dom),function(node){
        hljs.highlightBlock(node);
      });

      var comments = new L.views.comments.init(commentDom,'blog-' + id,{
        list_num: 8
      });
    });
  };
});