<%= grunt.file.read('src/css/Cleanup.css') %>
<%= grunt.file.read('src/css/Original.css') %>
<%= grunt.file.read('src/css/General.css') %>
<%= grunt.file.read('src/css/Colors.css') %>
<%= grunt.file.read('src/css/Fonts.css') %>
" + $SS.theme.customCSS + "
" + ($SS.conf["Sidebar Position"] !== 3 ? "<%= grunt.file.read('src/css/Sidebar.css') %>" : "") + "
<%= grunt.file.read('src/css/Quickreply.css') %>
<%= grunt.file.read('src/css/Icons.css') %>
<%= grunt.file.read('src/css/Highlight.css') %>
<%= grunt.file.read('src/css/Catalog.css') %>
<%= grunt.file.read('src/css/Home.css') %>
<%= grunt.file.read('src/css/Notifications.css') %>
/* Notifications*/
" + ($SS.conf["Center Notifications"] ? "#styletower-notifications{right:auto;left:50%;transform:translateX(-50%);width:min(500px,calc(100vw - 20px))}.ts-notifs #notification_container{right:auto!important;top:30px!important;left:50%!important;transform:translateX(-50%)!important;width:min(480px,calc(100vw - 20px))!important}" : "") + "
" + ($SS.conf["Full Border"] ? "#styletower-notifications .styletower-notification,.ts-notifs #notification_container .notification_div{border:" + $SS.conf["Width Decoration"] + "px " + $SS.conf["Highlight Style"] + " !important}#styletower-notifications .styletower-notification-info{border-color:#6f8fb3!important}#styletower-notifications .styletower-notification-warning{border-color:#c7a85a!important}#styletower-notifications .styletower-notification-error{border-color:#c06b6b!important}#styletower-notifications .styletower-notification-success{border-color:var(--sc-quoteColor)!important}" : "") + "
/* Scrollbars */
" + ($SS.conf["Style Scrollbars"] ? ":root{scrollbar-color:var(--sc-titleColor) var(--sc-bgColor)}.field,#emote-list{scrollbar-color:var(--sc-textColor) var(--sc-inputColor)}" : "") + "
" + ($SS.conf["Style Scrollbars"] && $SS.conf["Thin Scrollbars"] ? "*{scrollbar-width:thin}" : "") + "
/* Leave one at the bottom otherwise file format breaks */
<%= grunt.file.read('src/css/Options.css') %>
