var articles = $(".main_parts article");
articles.on("mouseenter",function () {
    articles.addClass("inactive_article");
   $(this).removeClass("inactive_article");
   $(this).addClass("active_article");
});

articles.on("mouseleave",function () {
    articles.removeClass("inactive_article");
    articles.removeClass("active_article");
});