import {
    Autowired,
    Component,
    ICellRenderer,
    ISparklineCellRendererParams,
    RefSelector,
    ResizeObserverService
} from "@ag-grid-community/core";
import { LineSparkline } from "./sparkline/lineSparkline";
import { AreaSparkline } from "./sparkline/areaSparkline";
import { ColumnSparkline } from "./sparkline/columnSparkline";
import { AgSparkline } from "./sparkline/agSparkline";

export class SparklineCellRenderer extends Component implements ICellRenderer {

    private static TEMPLATE = /* html */
        `<div class="ag-sparkline-wrapper">
            <span ref="eSparkline"></span>
        </div>`;

    @RefSelector('eSparkline') private eSparkline?: HTMLElement;
    @Autowired('resizeObserverService') private resizeObserverService?: ResizeObserverService;

    private sparkline?: LineSparkline | AreaSparkline | ColumnSparkline;

    constructor() {
        super(SparklineCellRenderer.TEMPLATE);
    }

    public init(params: any): void {
        const { clientWidth, clientHeight } = this.getGui();

        const options = {
            data: params.value,
            width: clientWidth,
            height: clientHeight,
            ...params.sparklineOptions
        }

        this.sparkline = AgSparkline.create(options as any);

        if (this.eSparkline) {
            this.eSparkline.appendChild(this.sparkline.canvasElement);
        }

        const updateSparklineWidthFunc = () => {
            if (this.sparkline) {
                const { clientWidth, clientHeight } = this.getGui();
                this.sparkline.width = clientWidth;
                this.sparkline.height = clientHeight;
            }
        }

        if (this.resizeObserverService) {
            const unsubscribeFromResize = this.resizeObserverService.observeResize(this.getGui(), updateSparklineWidthFunc);
            this.addDestroyFunc(() => unsubscribeFromResize());
        }
    }

    public refresh(params: ISparklineCellRendererParams): boolean {
        if (this.sparkline) {
            this.sparkline.data = params.value;
        }
        return true;
    }

    public destroy() {
        console.log("destroy")
        super.destroy();
    }
}