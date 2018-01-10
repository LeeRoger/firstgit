/*根据滑块所在位置填充进度条

  实现对滑动控件属性的设置、事件的监听、以及设置回调函数。
  监听input事件时，对进度条进行填充*/

$.fn.RangeSlider = function(cfg){
    this.sliderCfg = {
        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null, 
        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        step: cfg && Number(cfg.step) ? cfg.step : 1,
        callback: cfg && cfg.callback ? cfg.callback : null
    };

    var $input = $(this);
    var min = this.sliderCfg.min;
    var max = this.sliderCfg.max;
    var step = this.sliderCfg.step;
    var callback = this.sliderCfg.callback;

    $input.attr('min', min)
        .attr('max', max)
        .attr('step', step);

    $input.bind("input", function(e){
        $input.attr('value', this.value);
        //console.log(((parseFloat(this.value)-4)/14)*100+0.1);
        var colorWidth = ((parseFloat(this.value)-4)/14)*100;
        var colorBreak = ((parseFloat(this.value)-4)/14)*100+0.1;
        //console.log(colorBreak);
        var linearGradient = 'linear-gradient(to right, #FBB435, #FBB435 ' + colorWidth + '%, gray ' + colorBreak +'%, gray)';
        //console.log(linearGradient);
        $input.css('background', linearGradient);
        /*$input.css( 'background-color', '#FBB435' );*/
        /*$input.css( 'background', 'linear-gradient(to right, #059CFA, white ' + this.value + '%, white)' );*/
        /*$input.css( 'background', 'linear-gradient(to right, #FBB435, #FBB435 ' + this.value + '%, white toString(parseFloat(' + this.value + ')+0.1)%, white)' ); */
        /*$input.css( 'background-color', '#FBB435' );*/

        if ($.isFunction(callback)) {
            callback(this);
        }
    });
};

/*通过cfg对象来设置滑动控件的min, max, step属性。
对控件绑定input事件，当滑块滑动时会触发该事件，此时完成对进度条的填充，
这里我使用的是线性渐变
linear-gradient(to right, #059CFA, white ’ + this.value + ‘%, white)这种方式，
淡蓝色和白色两种颜色从左至右渐变，渐变的长度根据此时控件的value来确定。
事件触发时同时调用回调函数，回调函数完成的功能可自行设计。

当然你还可以根据自己的需求来监听其他事件，
比如change事件，当value值改变时会触发，用法上很灵活。*/