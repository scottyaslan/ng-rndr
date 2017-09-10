(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrDeriverTemplates', [], function() {
            return (root.rndr.templates.derivers = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.templates.derivers = factory());
    } else {
        root.rndr.templates.derivers = factory();
    }
}(this, function() {
    /**
     * Removes padding from a number.
     * 
     * @param  {number} number The number to zero pad.
     * @return {string}        The zero pad string representation of the `number`.
     */
    var zeroPad = function(number) {
        return ('0' + number).substr(-2, 2);
    };

    /**
     * A dictionary of 'deriver generator' functions: the keys are the names of the new attributes, and the functions take an existing record and return the value of the new attribute.
     */
    function DeriverTemplates() {}
    DeriverTemplates.prototype = {
        constructor: DeriverTemplates,
        /**
         * Adds a deriver function.
         * 
         * @param {string} name       The lookup name of the deriver function.
         * @param {function} deriver The function which *derives* an attribute.
         */
        add: function(name, deriver) {
            this[name] = deriver;
        },
        /**
         * Lists the available `attribute deriving` functions.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        },
        /**
         * Generates a function that performs a 'binning' of high-cardinality attributes into a lower-cardinality bucket.
         * @param  {string} col      The column name.
         * @param  {number} binWidth The width of the bin.
         * @return {function}        A function that takes an existing record and returns the value of the new attribute.
         */
        bin: function(col, binWidth) {
            return function(record) {
                return record[col] - record[col] % binWidth;
            };
        },
        /**
         * Generates a function that performs a 'binning' of  date or date-time values by day, hour, minute, week, month etc.
         * 
         * @param  {string} col      The column name.
         * @param  {string} formatString The date format. Interpolates as follows:
         *                               **%y**: date.getFullYear()
         *                               **%m**: zeroPad(date.getMonth()+1)
         *                               **%n**: mthNames[date.getMonth()]
         *                               **%d**: zeroPad(date.getDate())
         *                               **%w**: dayNames[date.getDay()]
         *                               **%x**: date.getDay()
         *                               **%H**: zeroPad(date.getHours())
         *                               **%M**: zeroPad(date.getMinutes())
         *                               **%S**: zeroPad(date.getSeconds())
         * @param  {boolean} utcOutput   Determines whether or not to display the string 'UTC' in the output
         * @param  {object} mthNames     A dictionary of month names (where the string name of the month is the key)
         * @param  {object} dayNames     A dictionary of day name (where the string name of the day is the key)
         * @return {function}            A function that takes an existing record and returns the value of the new attribute.
         */
        dateFormat: function(col, formatString, utcOutput, mthNames, dayNames) {
            var utc;
            if (utcOutput == null) {
                utcOutput = false;
            }
            if (mthNames == null) {
                mthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            }
            if (dayNames == null) {
                dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            }
            utc = utcOutput ? 'UTC' : '';
            return function(record) {
                var date;
                date = new Date(Date.parse(record[col]));
                if (isNaN(date)) {
                    return '';
                }
                return formatString.replace(/%(.)/g, function(m, p) {
                    switch (p) {
                        case 'y':
                            return date['get' + utc + 'FullYear']();
                        case 'm':
                            return zeroPad(date['get' + utc + 'Month']() + 1);
                        case 'n':
                            return mthNames[date['get' + utc + 'Month']()];
                        case 'd':
                            return zeroPad(date['get' + utc + 'Date']());
                        case 'w':
                            return dayNames[date['get' + utc + 'Day']()];
                        case 'x':
                            return date['get' + utc + 'Day']();
                        case 'H':
                            return zeroPad(date['get' + utc + 'Hours']());
                        case 'M':
                            return zeroPad(date['get' + utc + 'Minutes']());
                        case 'S':
                            return zeroPad(date['get' + utc + 'Seconds']());
                        default:
                            return '%' + p;
                    }
                });
            };
        }
    };

    var $rndrDeriverTemplates = new DeriverTemplates();

    return $rndrDeriverTemplates;
}));
