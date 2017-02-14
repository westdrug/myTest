/*-----------------------------------------------------------------------------------*/
/*  dialog fz
/*-----------------------------------------------------------------------------------*/
(function() {
    var mod = '';
        mod +='<div class="modal fade bs-fzEle-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">';
        mod +='<div class="modal-dialog" role="document">';
        mod +='    <div class="modal-content">';
        mod +='    <div class="modal-header">';
        mod +='        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        mod +='        <h4 class="modal-title fz-modal-title" id="myModalLabel"></h4>';
        mod +='    </div>';
        mod +='    <div class="modal-body">';
        mod +='        <div id="fz-modal-ele"><i id="loading-m" class="icon-spinner icon-spin hide fs30"></i></div>';
        mod +='    </div>';
        mod +='    <div class="modal-footer">';
        mod +='        <button type="button" class="line-btn btn btn-default btn-lg" data-dismiss="modal"> 取 消 </button>';
        mod +='        <button type="button" class="line-btn btn btn-success btn-lg" id="fzDig-sub-btn"> 确 定 </button>';
        mod +='    </div>';
        mod +='    </div>';
        mod +='</div>';
        mod +='</div>';

    $('body').append(mod)
}())

/*** title: 标题,
     width: 自定义模态框宽度,
     url:  引入内容结构, 
     index: 类型，0 => 提示型；1 => 操作型
     callback: 回调形参
***/
var fzDialog = {}
    fzDialog.Focus = {
        init: function(args) {
            this.title = args.title ? args.title : '友情提示',
            this.width = args.width ? args.width : '',
            this.index = args.index,
            this.url = args.url,
            this.callback = args.callback

            this.start()
        },
        start: function() {
            var _t = this,
                _m = $('#fz-modal-ele')
                _e = null

            //提示类型模态框
            if(_t.index === 0) {
                clearTimeout(_e)
                $('.modal-header, .modal-footer', '.bs-fzEle-modal-lg').hide()
                $('.bs-fzEle-modal-lg').modal('show')
                _m.addClass('text-center fs18 c-orange').empty().html(_t.url).prepend('<i class="icon-lightbulb fs24 mr10"></i>')
                _e = setTimeout(function() {
                    $('.bs-fzEle-modal-lg').modal('hide')
                    if($.isFunction(_t.callback)) _t.callback()
                }, 3000)
                return
            }

            //操作类型模态框
            if(_t.index === 1) {
                $('.fz-modal-title').text(_t.title)
                $('.bs-fzEle-modal-lg>.modal-dialog').css('width', _t.width + 'px')
                $('.modal-header, .modal-footer', '.bs-fzEle-modal-lg').show()
                $('.bs-fzEle-modal-lg').modal('show')

                $.ajax({
                    type: 'GET',
                    cache: false,
                    url: _t.url,
                    dataType: 'text',
                    async: false,
                    beforeSend: function(XMLHttpRequest) {
                        _m.find('.loading-m').show()
                    },
                    success: function(res) {
                        _m.empty().html(res)
                    },
                    error: function(xhr, ajaxOptions, thrownError) {

                    }
                })
                if($.isFunction(_t.callback)) $('#fzDig-sub-btn').unbind().bind('click', _t.callback)
                return
            }

        }
    }