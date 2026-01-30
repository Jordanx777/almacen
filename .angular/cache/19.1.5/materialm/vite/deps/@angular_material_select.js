import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-GZJGUUAI.js";
import "./chunk-HCPU67LT.js";
import "./chunk-R4QB32YE.js";
import "./chunk-IFH6XLEL.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-S2IU7B5P.js";
import "./chunk-TNYB7O4Y.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-57EOC4FJ.js";
import "./chunk-M6ZN3IKS.js";
import "./chunk-554UQC5G.js";
import "./chunk-WDMTKBIW.js";
import "./chunk-WHGEUOD3.js";
import "./chunk-VVZ3XCM6.js";
import "./chunk-IWPP7MQQ.js";
import "./chunk-7BEWGMSR.js";
import "./chunk-R3WYMSMV.js";
import "./chunk-3LOVMXBG.js";
import "./chunk-LQ6JPF57.js";
import "./chunk-OZ7C5UV6.js";
import "./chunk-42FJBLFI.js";
import "./chunk-GV5LUSDY.js";
import "./chunk-IGWZQRJK.js";
import "./chunk-BPESPTNP.js";
import "./chunk-JNNJX2PD.js";
import "./chunk-2O4WY5GE.js";
import "./chunk-UMNIC65D.js";
import "./chunk-NFZO2VRQ.js";
import "./chunk-TLKLTHLA.js";
import "./chunk-UZSQHYXK.js";
import "./chunk-MADP5KZN.js";
import "./chunk-MMVZ32PN.js";
import "./chunk-SK4LNZ4V.js";
import "./chunk-DG6N4IH3.js";
import "./chunk-XND3N4RP.js";
import "./chunk-PRWHWISX.js";
import "./chunk-Z3HSZS6E.js";
import "./chunk-EXKBCPV4.js";
import "./chunk-64GCYQJS.js";
import "./chunk-LBHABURH.js";
import "./chunk-ZGR3XN7N.js";
import "./chunk-243NFYEQ.js";
import "./chunk-6IPYV47H.js";
import "./chunk-TXDUYLVM.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanelWrap', [
  //   transition('* => void', query('@transformPanel', [animateChild()], {optional: true})),
  // ])
  /**
   * This animation ensures the select's overlay panel animation (transformPanel) is called when
   * closing the select.
   * This is needed due to https://github.com/angular/angular/issues/23302
   */
  transformPanelWrap: {
    type: 7,
    name: "transformPanelWrap",
    definitions: [{
      type: 1,
      expr: "* => void",
      animation: {
        type: 11,
        selector: "@transformPanel",
        animation: [{
          type: 9,
          options: null
        }],
        options: {
          optional: true
        }
      },
      options: null
    }],
    options: {}
  },
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [{
      type: 0,
      name: "void",
      styles: {
        type: 6,
        styles: {
          opacity: 0,
          transform: "scale(1, 0.8)"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "void => showing",
      animation: {
        type: 4,
        styles: {
          type: 6,
          styles: {
            opacity: 1,
            transform: "scale(1, 1)"
          },
          offset: null
        },
        timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
      },
      options: null
    }, {
      type: 1,
      expr: "* => void",
      animation: {
        type: 4,
        styles: {
          type: 6,
          styles: {
            opacity: 0
          },
          offset: null
        },
        timings: "100ms linear"
      },
      options: null
    }],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
