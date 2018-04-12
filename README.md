# Inline Editing
 HTML REQUIREMENTS AND MODULES RULES TO USE THIS MODULE
 *  A parent class with category name should be created, html should be written in that parent class
 *  editable fields should have a parent class called `data` which is child to category
 *  editable field should have class name which is the name of the field in json(not neccessory but recommended, customizable)
 *  declare values that should be float using float setters `set_float_keys`, get them using getters respectively
 *  store multiple categories(blocks) in view with one instance using getters and setters
 *  get values of each category(block) using `get_block_keys`, setters are not available for category(READ ONLY)
 *  get values of all categories(blocks) using `get_blocks_keys`, setters are not available for category(READ ONLY)
