/*
 * V.I.T.A. - "Salva in PDF"
 * Once a chat has its summary report, a button is shown after the last message: it downloads the whole
 * conversation as a PDF, written by the app itself (see scripts/chat_pdf.py).
 */
(function () {
    const BUTTON_ID = "vita-pdf";
    const REPORT = '[data-step-type="assistant_message"] img[src*="/avatars/Primario"]';
    const THREAD = /^\/thread\/([0-9a-f-]+)/i;
    const archived = new Map();  // Chat id -> whether the archive holds it, once the app has answered.

    function createButton() {
        const button = document.createElement("button");
        button.id = BUTTON_ID;
        button.type = "button";
        button.textContent = "Salva in PDF";
        button.title = "Scarica tutta la conversazione in PDF";
        button.addEventListener("click", () => {
            const thread = THREAD.exec(window.location.pathname);
            if (thread) window.location.assign("/vita/pdf/" + thread[1]);
        });
        return button;
    }

    // A trial chat (test fiscal code) is kept out of the archive, so it has no PDF: the app is asked once per chat.
    function isArchived(thread) {
        if (archived.has(thread)) return archived.get(thread);
        archived.set(thread, undefined);
        fetch("/project/thread/" + thread, { credentials: "same-origin" })
            .then((response) => {
                archived.set(thread, response.ok);
                placeButton();
            })
            .catch(() => archived.delete(thread));
        return undefined;
    }

    // Keeps the button as the last element of the chat, and only in an archived chat that has its report.
    function placeButton() {
        const existing = document.getElementById(BUTTON_ID);
        const report = document.querySelector(REPORT);
        const step = report && report.closest(".step");
        const thread = THREAD.exec(window.location.pathname);
        if (!step || !step.parentElement || !thread || isArchived(thread[1]) !== true) {
            if (existing) existing.remove();
            return;
        }
        const messages = step.parentElement;
        const button = existing || createButton();
        if (messages.lastElementChild !== button) messages.appendChild(button);
    }

    let scheduled = false;
    new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        // A timer rather than requestAnimationFrame, which the browser pauses while the page is not drawn.
        setTimeout(() => {
            scheduled = false;
            placeButton();
        }, 100);
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
