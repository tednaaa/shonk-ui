# Changelog

## v0.7.0 (2026-09-25)

- fix(styles): tint remaining field-like controls across the kit [`e35cd982`](https://github.com/tednaaa/shonk-ui/commit/e35cd9821a53899d9f67bcdf36ec0ff61afd187e)
- feat(theme): ship a dependency-free validator CLI and API for custom themes [`0537f58a`](https://github.com/tednaaa/shonk-ui/commit/0537f58aa129c4150981244b4c89acf9ebf35f7a)
- refactor(theme): replace dark utilities with mode-aware tokens and tint light fields [`40df0972`](https://github.com/tednaaa/shonk-ui/commit/40df097296679f7a4f7bab8eb753a688104dea2a)
- feat(theme)!: ship selectable theme presets and make atlas the default palette [`b6e3ca94`](https://github.com/tednaaa/shonk-ui/commit/b6e3ca9452fddb1a7bce308210f04c0dedc2f8be)
- feat(input-otp)!: replace the compound API with one component and drop vue-input-otp [`ff82a762`](https://github.com/tednaaa/shonk-ui/commit/ff82a762ed8ce893cf8eecdaa32aa9b7cff3dc8a)
- fix(confirm-dialog): keep the message and buttons filled in while the dialog closes [`cb3e2776`](https://github.com/tednaaa/shonk-ui/commit/cb3e277643d893decefef260c94b824710f978d7)
- feat(confirm-dialog)!: add acceptButtonVariant, primary instead of always destructive [`f0321189`](https://github.com/tednaaa/shonk-ui/commit/f03211898921c5d970cf11c98f93c1a4573d5336)
- feat!: remove AlertDialog and rebuild ConfirmDialog on Dialog [`c08db830`](https://github.com/tednaaa/shonk-ui/commit/c08db8308e091a63c0b2398f2d60e5092315bcbb)
- feat(data-table): download the shown rows as CSV or XLSX with DataTableExport [`b3086931`](https://github.com/tednaaa/shonk-ui/commit/b3086931b321f43ca9c024b158923c221c7eeab5)
- feat(data-table): merge adjacent cells with the same value through the spanRows column field [`e6b71c6a`](https://github.com/tednaaa/shonk-ui/commit/e6b71c6aa8ca1700783ac140de804083c71c9d4d)
- feat(data-table): pin rows above and below the other rows with a sticky rowPinning ref [`6196e297`](https://github.com/tednaaa/shonk-ui/commit/6196e297e6baa522951d3847d8bbf3c281d0b37c)
- feat(data-table): expand rows into a detail row with expandColumn [`8060c1fa`](https://github.com/tednaaa/shonk-ui/commit/8060c1facff0387fa0ce7d998273929465851676)
- feat(data-table): pin columns to the start, merge header placeholders with rowspan and add a sticky footer [`cf92efc7`](https://github.com/tednaaa/shonk-ui/commit/cf92efc79d4d9a618c9cf78aabfb312dfdff3513)
- feat(data-table): add DataTableColumnToggle, a searchable popover that hides and shows columns right away [`c904dafc`](https://github.com/tednaaa/shonk-ui/commit/c904dafc3a9ce36e602727389649ea34f4643a11)
- feat(data-table): add selectColumn with page and row checkboxes and a selected rows ref [`fb2aac71`](https://github.com/tednaaa/shonk-ui/commit/fb2aac71cee79c3a5b5c3f1aa5a01992f505e574)
- feat(data-table): ask for the next page when the table is scrolled close to the bottom [`535307df`](https://github.com/tednaaa/shonk-ui/commit/535307dfd0688a5d8c269e60e0b1945846cea492)
- feat(data-table): add DataTablePagination with default and compact pages and a page size select [`0715902a`](https://github.com/tednaaa/shonk-ui/commit/0715902abb3850f640afea9b86490b0fc5f49f1b)
- feat(data-table): add column sorting with a sorting ref, server mode and shift multi-sort [`fd160bc3`](https://github.com/tednaaa/shonk-ui/commit/fd160bc34550c7e2353d0067d0f8b93dfd53e84c)
- fix(table)!: change the row background on hover only when the data table row is clickable [`7b293d51`](https://github.com/tednaaa/shonk-ui/commit/7b293d5144c5761ea5f5775650240c083d4926c9)
- feat(data-table): add useDataTable and a base DataTable on TanStack Table 9 [`df753ebf`](https://github.com/tednaaa/shonk-ui/commit/df753ebf37cfe44cd99c094d1d26de8980c032aa)
- refactor(file)!: rename downloadFile to downloadBlob [`abee96a0`](https://github.com/tednaaa/shonk-ui/commit/abee96a0e3d13fb4005d78ae381c54ecafd1015f)
- feat(badge)!: drop the outline variant and give secondary its outlined look [`69066d7a`](https://github.com/tednaaa/shonk-ui/commit/69066d7a0d4b530e55353a2d709b9ff627845a03)
- feat(button)!: drop the outline variant and give secondary its outlined look [`aa834c4c`](https://github.com/tednaaa/shonk-ui/commit/aa834c4ccbc7d73f9b4571aadde84b3f0322e5c5)
- fix(pagination): name the pagination navigation and buttons in the kit locale instead of the English reka labels [`4ecd3dc8`](https://github.com/tednaaa/shonk-ui/commit/4ecd3dc8c92712191d888fff42da91f0de331079)
- feat(pagination): show double chevrons on the first and last page buttons [`b5e961b5`](https://github.com/tednaaa/shonk-ui/commit/b5e961b54d18ec756cfd5e701d2a5295924cdd78)
- fix(styles): give form fields their own fill so they stand out on dark panels [`ce8665bf`](https://github.com/tednaaa/shonk-ui/commit/ce8665bfbf28b6f4849c94716041885d9b2c4157)
- feat(input-otp): add the InputOTP component [`3581b4d0`](https://github.com/tednaaa/shonk-ui/commit/3581b4d0a98d9905f29771cde405d565db90ae80)
- feat(progress): add the Progress component [`4c732f54`](https://github.com/tednaaa/shonk-ui/commit/4c732f54ff7fb6c726db2e2d746fa54ec76d691d)
- fix(table): center a switch vertically in a table cell [`7549bb27`](https://github.com/tednaaa/shonk-ui/commit/7549bb2793705c44f4e8ddbd2722908f7c738c78)
- fix(command): keep the search when an item is toggled in a multiple selection [`f700dfbb`](https://github.com/tednaaa/shonk-ui/commit/f700dfbb92a138cd675da05409c76d0844156d0c)
- fix(checkbox): keep the check and minus icons in the checkbox color inside menu and list items [`800cdf6d`](https://github.com/tednaaa/shonk-ui/commit/800cdf6dbcb59084d3a7dda514bddd5ca2394907)
- feat!: ship reka-ui as a pinned dependency instead of a peer [`4255344e`](https://github.com/tednaaa/shonk-ui/commit/4255344e74d8a738331ad59bc1476a1c1a40b79e)
- docs(dialog): hide the title with sr-only instead of importing reka's VisuallyHidden [`63cea30e`](https://github.com/tednaaa/shonk-ui/commit/63cea30e0d8ba8feac68507e836718b9f949e82f)
- fix(sidebar)!: read the stored state on every mount and drop defaultOpen [`7da3bcec`](https://github.com/tednaaa/shonk-ui/commit/7da3bcec9ab49c735d2483d1a893c109457d9778)
- feat(alert): add the info variant [`860c7e5e`](https://github.com/tednaaa/shonk-ui/commit/860c7e5ebeec118b383e2ded08d5396fdd1dcfbb)
- feat(popover): export PopoverClose [`f41a0277`](https://github.com/tednaaa/shonk-ui/commit/f41a0277d37eef47a40b84e4bec919880d9766f3)
- feat(select): infer the model type through a generic [`0ccc428a`](https://github.com/tednaaa/shonk-ui/commit/0ccc428ab9407965fd93854e2faa3f37a18f78f9)
- fix(select): pass SelectTrigger attributes to the trigger button instead of its wrapper [`e857840c`](https://github.com/tednaaa/shonk-ui/commit/e857840c7b8a8e6ee86813fe6c40c917ff374ffb)
- fix(select): default the trigger size to md [`f3cce0f4`](https://github.com/tednaaa/shonk-ui/commit/f3cce0f4a8d8be6953a89618fd8bb2f817e5c59a)
- fix(styles): align select, native-select and input-group with the 40px control height [`1af1e83d`](https://github.com/tednaaa/shonk-ui/commit/1af1e83d484d3375266472ef96236363f454640c)
- fix(calendar): abbreviate weekdays to short so russian letters do not collide [`4043742b`](https://github.com/tednaaa/shonk-ui/commit/4043742bbb260fb2f745e56675664a7ed9aa3e97)
- fix(storybook): print story state the way it was written instead of as pretty JSON [`1bd44064`](https://github.com/tednaaa/shonk-ui/commit/1bd4406436af07031f070580975bfa5e3c027b20)
- fix(storybook): re-read the locale global inside the computed so the toolbar switch applies live [`2c86ea9a`](https://github.com/tednaaa/shonk-ui/commit/2c86ea9ae26931cd1685c0efa89a2179606cdab7)
- feat(filtered-search): add a token-based filter bar the app fills with its own operators, icons and value editors [`fc51b5fb`](https://github.com/tednaaa/shonk-ui/commit/fc51b5fb28a981945fc17c33c1dbb2ea69a932b6)

## v0.6.0 (2026-09-07)

- fix(storybook): dedent story templates that open on the backtick line [`5b53b4cd`](https://github.com/tednaaa/shonk-ui/commit/5b53b4cdd780e4babaa5e2b2709bc12b7e132992)
- docs: add examples for all components [`2733c4b8`](https://github.com/tednaaa/shonk-ui/commit/2733c4b853b60d6de154b74ee5d3ec953ee0c4d8)
- fix(storybook): highlight source snippets with a vue grammar instead of jsx [`b4bc13a3`](https://github.com/tednaaa/shonk-ui/commit/b4bc13a3287a9e6a623def87544609bc7c295790)

## v0.5.0 (2026-09-06)

- feat(storybook): show the rendered template in the code panel [`9299553c`](https://github.com/tednaaa/shonk-ui/commit/9299553ceba4aa3336ebf1a26992a7930b6857e2)
- feat: add SwipeAction component [`5e889e3e`](https://github.com/tednaaa/shonk-ui/commit/5e889e3edca6e591ab475ec0cf4c7571ce6b556d)
- build: emit unbundled output so consumers can tree-shake per component [`a2d59d63`](https://github.com/tednaaa/shonk-ui/commit/a2d59d632f83864057e70208734422765ec46d62)

## v0.4.0 (2026-08-30)

- refactor(theme)!: adopt shadcn-vue css variable convention [`a03b03a7`](https://github.com/tednaaa/shonk-ui/commit/a03b03a7445ddb56a4a8eb981079e9a6f5f1c33b)

## v0.3.0 (2026-08-21)

- localize component strings through useLocale() [`c0f96f7f`](https://github.com/tednaaa/shonk-ui/commit/c0f96f7fec1dafc987ecd2772c172ac5549c1cdd)
- add locale plugin for built-in component strings [`099640a3`](https://github.com/tednaaa/shonk-ui/commit/099640a3f23a9aee5ee6aa6a827d5b554038043e)

## v0.2.0 (2026-08-21)

- unquote class*= attribute selectors so icon sizes apply [`1a4296f5`](https://github.com/tednaaa/shonk-ui/commit/1a4296f5c36add5667935426353788432f40fc8a)
- ship CHANGELOG.md to dist too [`8d5254b5`](https://github.com/tednaaa/shonk-ui/commit/8d5254b579f584d7ce4f28a0e664b107825a80d9)
- bind carousel viewport with a function ref [`4f426393`](https://github.com/tednaaa/shonk-ui/commit/4f426393027de0b3299800cf92a7beeee156b0c7)
- translate UI strings to English [`07e5c30c`](https://github.com/tednaaa/shonk-ui/commit/07e5c30ce203ede33d1aedb16d6c8aac4153287c)

## v0.1.8 (2026-08-08)

- open changelog page by default [`01958c09`](https://github.com/tednaaa/shonk-ui/commit/01958c09c189b13f757ca58d64de668573dd168b)

## v0.1.7 (2026-08-08)

- fix: exclude sourcemaps from tailwind source scanning [`e81e6a5e`](https://github.com/tednaaa/shonk-ui/commit/e81e6a5e864e86c4b6c40ee2dd7d313b1b1597e2)

## v0.1.6 (2026-08-08)

- remove double \n\n as changelog commits seperator [`38c6c280`](https://github.com/tednaaa/shonk-ui/commit/38c6c2809a7601f2c586a9cf6820246036d5d8d5)

## v0.1.5 (2026-08-08)

- update pkgs [`356f61ac`](https://github.com/tednaaa/shonk-ui/commit/356f61ac4e0520cc7138a659420c1f9bf8545833)
- remove useless packages [`f325ee93`](https://github.com/tednaaa/shonk-ui/commit/f325ee938668a12f2b1f8a63fd43f30f9b00fcbc)
- cleanup code [`39eaf8a3`](https://github.com/tednaaa/shonk-ui/commit/39eaf8a3748d8e7fac5266156b28f6c29d84be79)

## v0.1.4 (2026-08-08)

- first release
