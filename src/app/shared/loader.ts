import { LoadingIndicator } from "nativescript-loading-indicator";

export class Loader {
    constructor(private loader: (LoadingIndicator)) {
        this.loader = new LoadingIndicator();
    }

    showLoader() {

        // optional options
        // android and ios have some platform specific options
        var options = {
            message: 'Loading...',
            progress: 0.65,
            android: {
                indeterminate: true,
                cancelable: true,
                cancelListener: function (dialog) { console.log("Loading cancelled") },
                max: 100,
                progressNumberFormat: "%1d/%2d",
                progressPercentFormat: 0.53,
                progressStyle: 1,
                secondaryProgress: 1
            }
        };

        this.loader.show(options);
    }

    hideLoader() {
        this.loader.hide();
    }
}


