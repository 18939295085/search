/**
 * Created by Administrator on 2017/10/26.
 */
$(function () {
    /*搜索*/
    $('.sear-tab p').on('click', function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        var index = $(this).index();
        $('.sear-book li').eq(index).show().siblings().hide()
    });
    var indinp = $('.ind-input input');
    var searinp = $('.search-inp input');
    $(indinp).focus(function () {
        $('.ind-bg').hide();
        $('.search').show();
    });
    $('.search-btn').on('click', function () {
        var val = $.trim($(searinp).val());
        if (val == '') {
            return false
        } else {
            var jsons = {
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"type": 1}},
                            {"match": {"show": 1}}
                        ],
                        "should": [
                            {"match": {"au_ch_name": val}},
                            {"match": {"ch_title": val}},
                            {"match": {"keywords": val}},
                            {"match": {"content": val}}
                        ]
                    }
                },
                "sort": [
                    {"_score": {"order": "desc"}},
                    {"time": {"order": "desc"}}
                ],
                "size": 10,
                "from": 0
            };
            $.ajax({
                "type": "POST",
                "url": "http://118.190.206.52:9200/searchdata/_search",
                "data": JSON.stringify(jsons),
                "dataType": "json",
                "success": function (data) {
                    var resolt = data.hits.hits;
                    for (let ind of resolt) {
                        var source = ind._source;
                        console.info(source);
                        var htmlss = `<div dataid="${source.id}" class="show-list">
                     <a href="${source.link}"><img src="http://active.dookbook.com/${source.img}" alt=""></a>
                     </div>`;
                        $('.sear-book #dans').append(htmlss);
                    }
                },
                "error": function (data) {
                }
            });
            var json = {
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"type": 0}},
                            {"match": {"show": 1}}
                        ],
                        "should": [
                            {"match": {"au_ch_name": val}},
                            {"match": {"ch_title": val}},
                            {"match": {"keywords": val}},
                            {"match": {"content": val}}
                        ]
                    }
                },
                "sort": [
                    {"_score": {"order": "desc"}},
                    {"time": {"order": "desc"}}
                ],
                "size": 10,
                "from": 0
            };
            $.ajax({
                "type": "POST",
                "url": "http://118.190.206.52:9200/searchdata/_search",
                "data": JSON.stringify(json),
                "dataType": "json",
                "success": function (data) {
                    var resolt = data.hits.hits;
                    for (let ind of resolt) {
                        var source = ind._source;
                        console.info(source);
                        var htmls = `<div dataid="${source.id}" class="show-book">
                                             <p class="fl"><img src="http://active.dookbook.com/${source.img}" alt=""></p>
                                             <div class="show-cont fl">
                                                 <h2>${source.ch_title}</h2>
                                                 <p>作者: <span>${source.au_ch_name}</span></p>
                                                 <div>简介：<span>${source.content}</span></div>
                                             </div>
                                     </div>`;
                        $('.sear-book #books').append(htmls);
                    }
                    $(".show-book").on("click", function () {
                        var headerurl = $(this).children(".fl").children("img").attr("src");
                        var bookname = $(this).children('.show-cont').children('h2').text();
                        var zname = $(this).children('.show-cont').children('p').children("span").text();
                        var booktxt = $(this).children('.show-cont').children('div').children("span").text();
                        window.localStorage.setItem('headerurl', headerurl);
                        window.localStorage.setItem('bookname', bookname);
                        window.localStorage.setItem('zname', zname);
                        window.localStorage.setItem('booktxt', booktxt);
                        window.location.href = 'buy.html';
                    })
                },
                "error": function (data) {
                }
            });
        }
    });
    $(searinp).keyup(function () {
        if ($(searinp).val() == '') {
            $('.show-book,.show-list').remove();
        }
    });


})
;