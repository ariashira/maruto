/**
 * スクロールが特定のエリアに入ったかどうかを検知
 */
jQuery(window).scroll(function () {
  var header = jQuery(".bl_header");
  var headerNav = jQuery(".bl_header_nav");
  var headerLogo = jQuery(".bl_header .el_logo");
  var headerLogoWrap = jQuery(".bl_header .el_logo_wrapper");
  let scrollTop = jQuery(window).scrollTop(); // スクロール上部の位置
  // let areaTop = jQuery("#health").offset().top; // 対象エリアの上部の位置
  let areaTop = jQuery(".js_scrollDetect").offset().top; // 対象エリアの上部の位置
  let offsetHeight = 0; //対象エリアが画面上から何pxの時に反応するかを調整
  let detectPoint = scrollTop + offsetHeight;
  if (detectPoint > areaTop) {
    // スクロールが対象エリアに入った場合
    jQuery(".bl_header_overlay").addClass("js_show");
    header.addClass("js_header__narrow");
    headerNav.addClass("js_header__narrow");
    headerLogo.addClass("js_header__narrow");
    headerLogoWrap.removeClass("hp_hide__lg");
  } else {
    // スクロールが対象エリアから出ている場合
    jQuery(".bl_header_overlay").removeClass("js_show");
    header.removeClass("js_header__narrow");
    headerNav.removeClass("js_header__narrow");
    headerLogo.removeClass("js_header__narrow");
    headerLogoWrap.removeClass("js_header__narrow");
    headerLogoWrap.addClass("hp_hide__lg");
  }
});

/**
 * フェードイン
 */
jQuery(window).on("load scroll", function () {
  jQuery(".js_fadeIn").each(function () {
    var winScroll = jQuery(window).scrollTop();
    var winHeight = jQuery(window).height();
    var scrollPosition = winScroll + winHeight * 0.8;
    if (jQuery(this).offset().top < scrollPosition) {
      jQuery(this).css({ opacity: 1, transform: "translate(0, 0)" });
    }
  });
});

/**
 * ドロワーメニューでページ内移動だけの場合にドロワー表示/非表示のチェックボックスを操作
 */
jQuery(function () {
  jQuery(".js_nav_link").click(function () {
    jQuery("#hamburger_checkBox").removeAttr("checked").prop("checked", false).change();
  });
});

/**
 * swiper MV用
 */
if (window.location.pathname === "/") {
  const swiper_MV = new Swiper(".js_swiper_MV", {
    loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: true,
    },
    effect: "fade",
    speed: 2000,
    allowTouchMove: true,
    // Navigation arrows
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
  });
}

/**
 * アコーディオン開閉
 */
jQuery(function () {
  jQuery(".js_accordion").off("click"); //input,label,buttonなどの要素の場合クリックイベントが2回発生するのを回避
  jQuery(".js_accordion").on("click", function () {
    jQuery(this).toggleClass("is_active");
    var item = jQuery(this).closest(".bl_accordion_item");
    jQuery(item).toggleClass("is_active");
    var body = jQuery(this).closest(".js_accordion_heading").next(".bl_accordion_body");
    body.slideToggle();
  });
});
