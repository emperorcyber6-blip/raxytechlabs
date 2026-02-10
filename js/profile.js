tailwind.config = {
    theme: {
        extend: {
            colors: {
                'neon-blue': '#7b2cbf',
                'neon-green': '#ffd700',
            },
            fontFamily: {
                'space': ['"Space Grotesk"', 'sans-serif'],
                'sans': ['"Outfit"', 'sans-serif'],
            },
        }
    }
}

window.onload = function () {
    window.print();
}
