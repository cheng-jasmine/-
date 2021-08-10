(function () {

    /**
     * @params {object} options 翻页的数据
     *          current:当前页码
     *          total:总页码
     *          change: 切换页码的时候触发的回调函数
    */
    function TurnPage(options, wrap) {
        this.wrap = wrap;
        this.total = options.total || 1;
        this.current = options.current || 1;
        //作用：用于与外部页面产生联系
        this.change = options.change || function () {};
    }

    //翻页初始化方法
    TurnPage.prototype.init = function () {
        //创建翻页结构
        this.fillHTML();
        this.bindEvent();
    }

    //创建翻页的结构
    TurnPage.prototype.fillHTML = function () {
        //翻页的包裹层
        var myPageWrapper = $('<ul class="my-page"></ul>');
        //判断插入上一页
        if (this.current > 1) {
            $('<li class="prev-btn">上一页</li>').appendTo(myPageWrapper);
        }
        //插入第一页
        $('<li class="my-page-num">1</li>').appendTo(myPageWrapper).addClass(this.current == 1 ? 'my-page-current' : '');
        //插入前面的省略号 (判断当前也与第一页之间是否含有页码，如果有则添加省略号)
        if (this.current - 2 - 1 > 1) {
            $('<span>...</span>').appendTo(myPageWrapper);
        }
        //插入中间5页的结构
        for (var i = this.current - 2; i <= this.current + 2; i++) {
            if (i > 1 && i < this.total) {
                $('<li class="my-page-num">1</li>').text(i).appendTo(myPageWrapper).addClass(this.current == i ? 'my-page-current' : '');
            }
        }

        //添加后面的省略号
        if (this.total - (this.current + 2) > 1) {
            $('<span>...</span>').appendTo(myPageWrapper);
        }
        //插入最后一页
        // if (this.total > 1) {
        //     $('<li class="my-page-num"></li>').text(this.total).appendTo(myPageWrapper).addClass(this.current == this.total ? 'my-page-current' : '');
        // }
        this.total > 1 && $('<li class="my-page-num"></li>').text(this.total).appendTo(myPageWrapper).addClass(this.current == this.total ? 'my-page-current' : '');
        
        //插入下一页
        if (this.current < this.total) {
            $('<li class="next-btn">下一页</li>').appendTo(myPageWrapper);
        }

        this.wrap.empty().append(myPageWrapper);
    }

    //绑定事件
    TurnPage.prototype.bindEvent = function () {
        var self = this;
        //上一页功能
        this.wrap.find('.prev-btn').click(function () {
            self.current--;
            self.init();
            self.change(self.current);
        });
        //下一页功能
        this.wrap.find('.next-btn').click(function () {
            self.current++;
            self.init();
            self.change(self.current);
        });
        //点击页码的时候，将当前页变化成点击的页码
        this.wrap.find('.my-page-num').click(function () {
            self.current = parseInt($(this).text());
            self.init();
            self.change(self.current);
        });
    }
    

    //在jQuery上扩展翻页信息
    $.fn.extend({
        page: function (options) {
            var obj = new TurnPage(options, this);
            obj.init();
        },
    });
}())