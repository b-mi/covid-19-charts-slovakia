import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { EChartsOption } from 'echarts';
import { fromEvent, from, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-chart3',
  templateUrl: './chart3.component.html',
  styleUrls: ['./chart3.component.scss']
})
export class Chart3Component implements OnInit, OnDestroy {

  readonly debounceMs = 1500;
  title = "Denná percentuálna pozitivita PCR testov za okresy";
  sFromDate = '2020-11-01';
  private _fromDate: Date = new Date(2020, 10, 1);
  public get fromDate(): Date {
    return this._fromDate;
  }
  public set fromDate(value: Date) {
    this._fromDate = value;
    this.sFromDate = value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate();
    this.chartChanged();
  }

  userUpdate = new Subject();


  private _chart_selected: string = 'pcr-pos';
  public get chart_selected(): string {
    return this._chart_selected;
  }
  public set chart_selected(v: string) {
    this._chart_selected = v;
    this.chartChanged();
  }



  chartOption: EChartsOption = {
    legend: {
      data: ['bar', 'bar2', 'bar3'],
      align: 'left',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      silent: false,
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        name: 'bar',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
      {
        name: 'bar2',
        data: [1000, 820, 932, 901, 934, 1290, 1330,],
        type: 'line',
      },
      {
        name: 'bar3',
        data: [2000, 1000, 820, 932, 901, 934, 1290,],
        type: 'line',
      },],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
  };

  charts = [
    { id: 'pcr-pos', name: 'Percentuálna pozitivita PCR testov za okresy', defaultDistrict: ['Bratislava II', 'Piešťany'] },
    { id: 'pcr-tot', name: 'Počet vykonaných PCR testov za okresy', defaultDistrict: ['Bratislava II', 'Piešťany'] },
    { id: 'deads', name: 'Počet úmrtí', defaultDistrict: ['Slovensko'] },
    { id: 'new-cases', name: 'Počet nových prípadov potvrdených PCR testami', defaultDistrict: ['Slovensko'] },
  ]

  showChart = false;

  grps = [];
  labs = [];

  progressMode = 'determinate'

  constructor(private service: AppService) {

    this.userUpdate.pipe(
      debounceTime(this.debounceMs)
    ).subscribe(r => {
      this.reloadData();
    })
  }
  ngOnDestroy(): void {
    this.userUpdate.unsubscribe();
  }

  setBusy(isBusy: boolean) {
    this.progressMode = isBusy ? 'buffer' : 'determinate';
  }

  chartChanged() {
    this.setBusy(true);
    this.userUpdate.next('');
  }

  async ngOnInit() {
    await this.reloadData();
  }
  private async reloadData() {
    // this.showChart = true;
    const d = await this.service.covid2GetData(this.chart_selected, this.sFromDate) as any;

    this.grps = d.grps as any[];
    this.labs = d.labs as any[];
    (this.chartOption.xAxis as any).data = this.labs;
    (this.chartOption.legend as any).data = [];
    this.chartOption.series = [];

    const ch = <any>this.getChart();
    const defdistr = <any[]>ch.defaultDistrict;
    defdistr.forEach(distrName => {
      const dstr = this.grps.filter(i => i.district === distrName)[0];
      this.addDistrict(dstr, true);
    });
    setTimeout(() => {
      this.showChart = true;
      this.setBusy(false);
    }, 0);
  }

  getChart(): any {
    const ch = this.charts.filter(c => c.id === this.chart_selected)[0];
    return ch;
  }

  addDistrict(distr: any, add: boolean) {
    this.showChart = false;
    setTimeout(() => {

      const serName = distr.district;
      const series = <any[]>this.chartOption.series;
      if (add) {

        const legendData = (<any>this.chartOption.legend).data;
        legendData.push(serName);

        const ser: any = { name: serName, type: 'line', data: distr.data, smooth: true };
        series.push(ser);

        this.showChart = true;


      } else {
        this.chartOption.series = (<any[]>this.chartOption.series).filter(xx => xx.name !== distr.district);
        this.showChart = true;
      }

    }, 0);

    distr.selected = add;
    const ch = this.getChart();
    ch.defaultDistrict = this.grps.filter(g => g.selected).map(i => i.district);

  }

  district_Click(item) {
    this.addDistrict(item, item.selected ? false : true);
  }


  async reload() {
    await this.reloadData();
  }

}

