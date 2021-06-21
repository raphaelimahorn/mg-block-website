export class Assert {
    /**
     *
     * @param func {function:boolean}
     * @param msg {string?} a message displayed in failure case
     */
    static that(func, msg) {
        return new Result(func(), msg ?? '');
    }

    static isEqual(actual, expected) {
        return actual === expected ? Result.success() : Result.fail(
            `Expected: ${expected}
Got: ${actual}`);
    }

    /**
     *
     * @param func {function}
     * @param msg {string?}
     */
    static throws(func, msg) {
        try {
            func();
        } catch (_) {
            return Result.success();
        }
        return Result.fail(msg ?? 'expected function to throw');
    }
}

export class Result {

    /** @type boolean */
    isSuccessful;
    /** @type string | undefined */
    failureMsg;

    constructor(isSuccessful, failureMsg = undefined) {
        this.isSuccessful = isSuccessful;
        this.failureMsg = failureMsg;
    }

    static success() {
        return new Result(true);
    }

    static fail(failureMsg = '') {
        return new Result(false, failureMsg)
    }
}
