export default class VimeoLogin extends lng.Component {
    static _template() {
        return {
            Wrapper: {
                Title: {
                    text: {text: `Login`, fontSize: 45}
                },
                Info: {
                    y: 95,
                    text: {
                        text: `Sign in to your account to access your library and your own profile`,
                        maxLines: 3,
                        wordWrapWidth: 400,
                        lineHeight: 40,
                        fontSize: 24
                    }
                },
                Username: {
                    y: 210,
                    Label: {text: {text: `username`, fontSize: 21}},
                    Input: {
                        y: 30, texture: lng.Tools.getRoundRect(350, 50, 5, 2, 0xffffffff, true, 0x99ffffff)
                    }
                },
                Password: {
                    y: 310,
                    Label: {text: {text: `username`, fontSize: 21}},
                    Input: {
                        y: 30, texture: lng.Tools.getRoundRect(350, 50, 5, 2, 0xffffffff, true, 0x99ffffff)
                    }
                },
                Login: {
                    y: 430, x: 150,
                    Input: {
                        texture: lng.Tools.getRoundRect(200, 50, 5, 0, 0xffffffff, true, 0xff00ADEF)
                    },
                    Label: {x: 70, y: 8, text: {text: `login`, fontSize: 25}},
                }
            }
        };
    }

}