import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  NgModule,
  Optional,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵinject,
  ɵɵprojection,
  ɵɵprojectionDef
} from "./chunk-LBHABURH.js";
import "./chunk-ZGR3XN7N.js";
import "./chunk-243NFYEQ.js";
import "./chunk-6IPYV47H.js";
import {
  __spreadValues
} from "./chunk-TXDUYLVM.js";

// node_modules/angular-tabler-icons/fesm2020/angular-tabler-icons.mjs
var _c0 = ["*"];
var OptionsProvider = class {
  constructor(options) {
    this.options = options;
  }
};
function uppercamelcase(str) {
  return str.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (firstLetter) => {
    return firstLetter.toUpperCase();
  }).replace(/[-_]/g, "");
}
var TablerIconComponent = class {
  constructor(elem, changeDetector, options) {
    this.elem = elem;
    this.changeDetector = changeDetector;
    this.options = options;
  }
  ngOnChanges(changes) {
    const icons = Object.assign({}, ...this.options.map((option) => option.icons));
    const svg = icons[`Icon${uppercamelcase(changes.name.currentValue)}`] ?? "";
    if (!svg && !this.options.some((option) => option.ignoreWarnings)) {
      console.warn(`Tabler Icon not found: ${changes.name.currentValue}
Refer to documentation on https://github.com/pierreavn/angular-tabler-icons`);
    }
    this.elem.nativeElement.innerHTML = svg;
    this.changeDetector.markForCheck();
  }
};
TablerIconComponent.ɵfac = function TablerIconComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || TablerIconComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(OptionsProvider));
};
TablerIconComponent.ɵcmp = ɵɵdefineComponent({
  type: TablerIconComponent,
  selectors: [["i-tabler"], ["tabler-icon"]],
  inputs: {
    name: "name"
  },
  standalone: false,
  features: [ɵɵNgOnChangesFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function TablerIconComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:inline-block;width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2px;stroke-linecap:round;stroke-linejoin:round}"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TablerIconComponent, [{
    type: Component,
    args: [{
      selector: "i-tabler, tabler-icon",
      template: "<ng-content></ng-content>\n",
      styles: [":host{display:inline-block;width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2px;stroke-linecap:round;stroke-linejoin:round}\n"]
    }]
  }], function() {
    return [{
      type: ElementRef,
      decorators: [{
        type: Inject,
        args: [ElementRef]
      }]
    }, {
      type: ChangeDetectorRef,
      decorators: [{
        type: Inject,
        args: [ChangeDetectorRef]
      }]
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [OptionsProvider]
      }]
    }];
  }, {
    name: [{
      type: Input
    }]
  });
})();
var TablerIconsModule = class _TablerIconsModule {
  constructor(options) {
    this.options = options;
    if (!this.options) {
      throw new Error(`No icon provided. Make sure to use 'TablerIconsModule.pick({ ... })' when importing the module
Refer to documentation on https://github.com/pierreavn/angular-tabler-icons`);
    }
  }
  /**
   * Initialize module with given icons and options
   * @param icons
   * @returns Module with options
   */
  static pick(icons, options) {
    return {
      ngModule: _TablerIconsModule,
      providers: [{
        provide: OptionsProvider,
        useValue: __spreadValues({
          icons
        }, options),
        multi: true
      }]
    };
  }
};
TablerIconsModule.ɵfac = function TablerIconsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || TablerIconsModule)(ɵɵinject(OptionsProvider, 8));
};
TablerIconsModule.ɵmod = ɵɵdefineNgModule({
  type: TablerIconsModule,
  declarations: [TablerIconComponent],
  exports: [TablerIconComponent]
});
TablerIconsModule.ɵinj = ɵɵdefineInjector({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TablerIconsModule, [{
    type: NgModule,
    args: [{
      declarations: [TablerIconComponent],
      exports: [TablerIconComponent]
    }]
  }], function() {
    return [{
      type: OptionsProvider,
      decorators: [{
        type: Optional
      }]
    }];
  }, null);
})();
var TablerIconsProvider = class {
  static pick(icons, options) {
    return {
      provide: OptionsProvider,
      useValue: __spreadValues({
        icons
      }, options),
      multi: true
    };
  }
};
export {
  TablerIconComponent,
  TablerIconsModule,
  TablerIconsProvider
};
//# sourceMappingURL=angular-tabler-icons.js.map
