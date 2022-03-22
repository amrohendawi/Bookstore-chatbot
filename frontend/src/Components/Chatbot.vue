<template>
  <div id="webchat"></div>
</template>

<script>

export default {
  name: "Chatbot",
  mounted() {
    let e = document.createElement("script"),
      t = document.head || document.getElementsByTagName("head")[0];
    e.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/npm/rasa-webchat/lib/index.min.js"
    );
    e.async = !0;
    e.onload = () => {
      window.WebChat.default(
        {
          selector: "#webchat",
          initPayload: "/greet",
          customData: { language: "de" },
          socketUrl: "http://localhost:5005",
          socketPath: "/socket.io/",
          title: "Rasa Bot",
          tooltipPayload: "/greet",
          tooltip: true,
          tooltipDelay: 500,
          // subtitle: "Powered by XYZ",
          connectingText: "Warten auf Server Antwort...",
          // profileAvatar: "@/assets/bot-icon.svg",
          // openLauncherImage: "https://w7.pngwing.com/pngs/811/700/png-transparent-chatbot-internet-bot-business-natural-language-processing-facebook-messenger-business-people-logo-fictional-character.png",
          params: { storage: "session" },
          mainColor: "#f7c655",
          userBackgroundColor: "#f7c655",
          userTextColor: "#ffffff",
          showMessageDate: true,
          inputTextFieldHint: "Nachricht schreiben...",
          badge: " ",
          displayUnreadCount: true,
          isChatOpen: false,
          embedded: false,
          showCloseButton: true,
          fullScreenMode: true,
          showFullScreenButton: true,
          docViewer: true,
        },
        null
      );
    };
    t.insertBefore(e, t.firstChild);
    document.head.appendChild(e);
  },
};
</script>