/** HTML REQUIREMENTS AND MODULES RULES TO USE THIS MODULE
 *  A parent class with category name should be created, html should be written in that parent class
 *  editable fields should have a parent class called `data` which is child to category
 *  editable field should have class name which is the name of the field in json(not neccessory but recommended, customizable)
 *  declare values that should be float using float setters `set_float_keys`, get them using getters respectively
 *  store multiple categories(blocks) in view with one instance using getters and setters
 *  get values of each category(block) using `get_block_keys`, setters are not available for category(READ ONLY)
 *  get values of all categories(blocks) using `get_blocks_keys`, setters are not available for category(READ ONLY)
*/

var inline_editing = function() {

  /** data declarations */
  var data_values = {};
  data_values['float_keys'] = {};
  data_values['string_keys'] = {};

  // SETTERS
  /** set float keys of the block */
  var set_float_keys = function(block_name, block_keys) {

    var float_keys = data_values['float_keys'];

    if (Array.isArray(block_keys))
      float_keys[block_name] = block_keys
    else
      console.log('Keys are not array');

    data_values['float_keys'] = float_keys;

  };

  /** set string keys of the block */
  var set_string_keys = function(block_name, block_keys) {

    var string_keys = data_values['string_keys'];

    if (Array.isArray(block_keys))
      string_keys[block_name] = block_keys
    else
      console.log('Keys are not array');

    data_values['string_keys'] = string_keys;
  };


  // GETTERS
  /** get all float keys */
  var get_float_keys = function() {
    return data_values['float_keys'];
  };

  /** get all string keys */
  var get_string_keys = function() {
    var string_keys = data_values['string_keys'];
    return string_keys;
  };

  /** get all block(categories) keys */
  var get_blocks_keys = function() {
    var blocks_keys = {}

    /** data_value has keys of data-type(like `float`, `string`),
     *  data-type has keys of blocks(`any-name` categories) and values of elements(classes from view that belong to the category)
     *  key: data-type, sub_key: elements */
    for (key in data_values) {
      for (sub_key in data_values[key]) {
        if (sub_key in blocks_keys) {
          blocks_keys[sub_key] = blocks_keys[sub_key].concat(data_values[key][sub_key]);
        }
        else {
          blocks_keys[sub_key] = data_values[key][sub_key];
        }
      }
    }

    return blocks_keys;

  };

  var get_block = function(event) {
    var blocks = Object.keys(get_blocks_keys());

    for (i in blocks) {
      if ($(event.target).parents(block_class(blocks[i])).length)
        return blocks[i];
    }

    console.log("Block as parent element not defined for the child element");
    return null
  }

  /** get float keys of a block(category) */
  var get_block_float_keys = function(block) {

    var float_keys = data_values['float_keys'];

    if (block in float_keys)
      return float_keys[block];
    else
      console.log('block doesnot exist in float keys');

  };

  /** get string keys of a block(category) */
  var get_block_string_keys = function(block) {

    var string_keys = data_values['string_keys'];

    if (block in string_keys)
      return string_keys[block];
    else
      console.log('block doesnot exist in float keys');

  };

  /** get keys of a block(category) */
  var get_block_keys = function(block) {
    var blocks_keys = get_blocks_keys();

    if (block in blocks_keys)
      return blocks_keys[block];
    else
      console.log('Block doesnot exist');

  };

  /** @param {String} block - Category
   *  @param {String} element - HTML Tag
   * (change type to element[like `input`, `h2`, `div` tag])
  */
  var change_type = function(block, element) {

    /** get all categories */
    var blocks = get_blocks_keys();

    /** if given block(category) exist in view(HTML, SLIM, HAML) */
    if ($(block_class(block))) {
      var block_element = $(block_class(block));

      /** Store block `data` which is parent for data classes that need to be edited */
      var data = block_element.find(block_class("data"));

      /** get keys of the block that declared in the beginning(keys that should be edited in view) */
      var edit_keys = blocks[block];

      /** iterate and change type to element(`input`, `textarea`) tag */
      for (key in edit_keys) {
        /** create element tag */
        var $create_element = $("<" + element + ">");

        /** get keys in view */
        var key_element = data.find(block_class(edit_keys[key]));
        /** clone the attributes of keys in view and set them to element created */
        $create_element = clone_attributes(key_element, $create_element);

        /** if element type is input change CSS to look editable and set the value */
        if (element == "input") {
          if (!$create_element.hasClass('edit-area'))
            $create_element.addClass('edit-area');
          $create_element.val(key_element.text());
          /** change options from edit to save on screen */
          block_options(block, "save");
        }
        /** else get value from input and set it to element(`h3`, `div`), non input elements */
        else {
          if ($create_element.hasClass('edit-area'))
            $create_element.removeClass('edit-area');
          $create_element.text(key_element.val());
        }

        /** reflect changes made above in view */
        data.find(block_class(edit_keys[key])).replaceWith($create_element);

      }
    }
  }


  /** @param {String} block - Category
   *  @param {String} option - save, cancel
   *  @param {Object} data - data in json to revert the values when cancelled
   * (change type to element[like `input` tag])
  */
  var action = function(block, option, data) {

    /** if data doesn't exist, create empty hash to save key-value pair in data */
    if (!data) {
      data = {};
    }

    var float_data_keys = get_float_keys();

    /** get the html data of that block(category) */
    var block_element = $(block_class(block));
    /** get html data of `data` inside block(category) where the data exists */
    var data_block = block_element.find(block_class("data"));

    /** get keys from a block(category) */
    var blocks = get_blocks_keys();
    var block_data = blocks[block];

    /** iterate through the keys */
    for (i in block_data) {
      /** if option is `save` save the changes from html */
      if (option == "save") {
        /** get value from input */
        var value = data_block.find(block_class(block_data[i])).val();

        /** check if it is a float value */
        if (float_data_keys[block].indexOf(block_data[i]) > -1)
          value = parseFloat(value);

        /** save value from view to data hash */
        data[block_data[i]] = value;
      }
      /** else revert the changes to original */
      else {
        data_block.find(block_class(block_data[i])).val(data[block_data[i]]);
      }
    }

    /** change view options to edit, and revert to element `h3` */
    block_options(block, "edit");
    change_type(block, "h3");

    return data;
  }

  /** save the changes
   *  @param {String} block - Category
   *  @param {Object} data - json with data, null if no data
  */
  var save = function(block, data) {
    return action(block, 'save', data);
  };

  /** cancel the changes
   * @param {String} block - Category
   * @param {Object} data - json with data, should not be null
   */
  var cancel = function(block, data) {
    action(block, 'cancel', data);
  };

  /** add `.` to make it a class and return
   *  @param {String} block - Category(element from HTML)
   */
  var block_class = function(block) {
    return "." + block;
  }

  /** clone attributes from one element to other element
   *  @param {String} old_block - present element tag which has attributes that are used to clone
   *  @param {String} new_block - element which the attributes should be copied
   */
  var clone_attributes = function(old_block, new_block) {
    /** get attributes of old block */
    var attributes = old_block.prop("attributes");

    /** save them to new block and return */
    $.each(attributes, function() {
      new_block.attr(this.name, this.value);
    });
    return new_block;
  };

  /** block options are `edit` which should show edit in view of that block
   *  `save` which should show save and cancel in view of that block
   *  @param {String} block - category(block) in view where the options should be changed
   *  @param {String} option - `edit`, `save`
   */
  var block_options = function(block, option) {
    remove_option = "edit";

    /** if block option is edit, it should remove save options from view */
    if (option == "edit")
      remove_option = "save";

    /** get elements from block(category) from view */
    var block_element = $(block_class(block));

    /** check if option exist or not before changing to avoid clashing */
    if (block_element.find(block_class(option)).hasClass("hidden"))
      block_element.find(block_class(option)).removeClass("hidden");
    if (!block_element.find(block_class(remove_option)).hasClass("hidden"))
      block_element.find(block_class(remove_option)).addClass("hidden")
  }


  return {
    set_float_keys: set_float_keys,
    set_string_keys: set_string_keys,

    get_float_keys: get_float_keys,
    get_block_float_keys: get_block_float_keys,
    get_string_keys: get_string_keys,
    get_block: get_block,

    get_block_string_keys: get_block_string_keys,
    get_blocks_keys: get_blocks_keys,
    get_block_keys: get_block_keys,

    change_type: change_type,
    save: save,
    cancel: cancel,
  };

};
