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
     subtn: 按钮文本内容,
     url:  引入内容结构, 
     index: 类型，0 => 提示型；1 => 操作型,
     isMove: 是否可拖拽，默认false,
     callback: 回调形参
***/
var fzDialog = {}
    fzDialog.Focus = {
        init: function(args) {
            this.title = args.title ? args.title : '提示',
            this.width = args.width ? args.width : '',
            this.subtn = args.subtn ? args.subtn : ' 确 定 ',
            this.index = args.index,
            this.url = args.url,
            this.isMove = args.isMove ? args.isMove : false,
            this.callback = args.callback

            this.start()
        },
        start: function() {
            var _t = this,
                _m = $('#fz-modal-ele')
                _e = null

            switch (_t.index) {
                case 0:         //提示类型模态框
                    clearTimeout(_e)
                    $('.modal-header, .modal-footer', '.bs-fzEle-modal-lg').hide()
                    $('.bs-fzEle-modal-lg').modal('show')
                    _m.addClass('text-center fs16').empty().html(_t.url).prepend('<i class="icon-lightbulb fs24 c-orange mr10"></i>')
                    _e = setTimeout(function() {
                        $('.bs-fzEle-modal-lg').modal('hide')
                        if($.isFunction(_t.callback)) _t.callback()
                    }, 3000)
                    break;

                case 1:         //操作类型模态框    
                    $('.bs-fzEle-modal-lg>.modal-dialog').removeClass('bs-fzEle-acf')                 
                    $('.fz-modal-title').html(_t.title)
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
                    if($.isFunction(_t.callback)) $('#fzDig-sub-btn').text(_t.subtn).unbind().bind('click', _t.callback)
                    break;

                case 2:         //alert confirm 类型模态框
                    $('.bs-fzEle-modal-lg>.modal-dialog').addClass('bs-fzEle-acf')
                    $('.fz-modal-title').html(_t.title)
                    $('.bs-fzEle-modal-lg>.modal-dialog').css('width', _t.width + 'px')    
                    $('.bs-fzEle-modal-lg').modal('show')
                    _m.addClass('text-center fs14').empty().html(_t.url)
                    if($.isFunction(_t.callback)) $('#fzDig-sub-btn').text(_t.subtn).unbind().bind('click', _t.callback)
                    break;

                case 3:         //组卷设置弹出    
                    $('.bs-fzEle-modal-lg>.modal-dialog').removeClass('bs-fzEle-acf')                 
                    $('.fz-modal-title').html(_t.title)
                    $('.bs-fzEle-modal-lg>.modal-dialog').css('width', _t.width + 'px')
                    $('.modal-header, .modal-footer', '.bs-fzEle-modal-lg').show()
                    $('.bs-fzEle-modal-lg').modal('show')

                    _m.empty().html(_t.url)

                    if($.isFunction(_t.callback)) $('#fzDig-sub-btn').text(_t.subtn).unbind().bind('click', _t.callback)
                    break;
            }

            _t.drag()
        },
        drag: function() {
            var _t = this
            if(!_t.isMove) return   //默认 false  不可拖拽
            
            var _winW = document.documentElement.clientWidth,
                _winH = document.documentElement.clientHeight,
                _sTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop,
                _sLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft,
                _dTop = (parseInt(_winH, 10)/2) + (parseInt(_sTop, 10)),
                _dLeft = (parseInt(_winW, 10)/2) + (parseInt(_sLeft, 10))

            var _w = $('.modal-dialog', '.bs-fzEle-modal-lg').get(0),
                _e = $('.modal-header', '.bs-fzEle-modal-lg').get(0),
                _g = false,
                _dx = _dy = 0

            _e.style.cursor = 'move'
            _e.onmousedown = function(event) {
                var event = event || window.event
                _g = true
                _dx = event.clientX - _w.offsetLeft
                _dy = event.clientY - _w.offsetTop
                this.setCapture && this.setCapture() //设置鼠标捕获
                return
            }

            document.onmousemove = function(event) {
                if(!_g) return
                var event = event || window.event,
                    _dl = event.clientX - _dx,
                    _dt = event.clientY - _dy,
                    _maxL = _winW + _dTop - _w.offsetWidth,
                    _maxT = _winH + _dLeft - _w.offsetHeight

                _dl = _dl < 0 ? 0 : _dl
                _dl = _dl > _maxL ? _maxL : _dl
                _dt = _dt < 0 ? 0 : _dt
                _dt = _dt > _maxT ? _maxT : _dt

                _w.style.marginLeft = _w.style.marginTop = 0
                _w.style.left = _dl + 'px'
                _w.style.top = _dt + 'px'
                return
            }

            document.onmouseup = document.onblur = _e.onlosecapture = function() {
                _g = false
                this.style.cursor = 'default'
                _e.releaseCapture && _e.releaseCapture()
            }

        }
    }
