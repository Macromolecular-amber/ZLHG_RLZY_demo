/* 全模块演示数据（虚构样例，按功能清单组织） */
window.HR_DATA2 = (function () {
  const D = window.HR_DATA;
  const E = D.EMPLOYEES;
  const e = (i) => E[i % E.length];
  const base = (i) => {
    const x = e(i);
    return { empNo: x.no, name: x.name, gender: x.gender, unit: x.unit, dept: x.dept, position: x.position, employment: x.employment };
  };

  /* ---------- 组织机构 ---------- */
  const ORG_UNITS = [
    { id: 'U01', name: '集团本部', full: '兰州中陆化工集团有限公司', desc: '集团总部 · 战略与管控', staff: 386, nodes: 42, positions: 198, manager: '张伟' },
    { id: 'U02', name: '三叶实业', full: '兰州三叶实业有限公司', desc: '劳务输出 · 承运 · 实业经营', staff: 726, nodes: 86, positions: 312, manager: '陈立' },
    { id: 'U03', name: '汇丰石化', full: '兰州汇丰石化有限公司', desc: '石化生产 · 产品销售', staff: 618, nodes: 74, positions: 268, manager: '王强' },
    { id: 'U04', name: '翔鑫工贸', full: '兰州翔鑫工贸有限责任公司', desc: '管输服务 · 工贸', staff: 452, nodes: 58, positions: 196, manager: '郑霞' },
    { id: 'U05', name: '维达石化', full: '兰州维达石化工程有限公司', desc: '化工设备维保 · 工程', staff: 268, nodes: 44, positions: 126, manager: '周鹏' },
    { id: 'U06', name: '宏达人力', full: '兰州宏达人力资源服务有限公司', desc: '人力资源服务', staff: 246, nodes: 26, positions: 78, manager: '孙慧' },
    { id: 'U07', name: '兰达工贸', full: '兰州兰达工贸有限公司', desc: '工程建设 · 工贸', staff: 150, nodes: 20, positions: 68, manager: '吴磊' }
  ];

  const ORG_TREE = {
    name: '中陆化工集团', code: 'ZL', type: '集团', count: 2846, children: [
      { name: '集团本部', code: 'ZL-01', type: '本部', count: 386, children: [
        { name: '生产运行部', code: 'ZL-01-01', type: '部门', count: 68, children: [
          { name: '生产调度中心', code: 'ZL-01-01-01', type: '科室', count: 18, children: [{ name: '调度值班组', code: 'ZL-01-01-01-01', type: '班组', count: 8, children: [] }] },
          { name: '运行管理科', code: 'ZL-01-01-02', type: '科室', count: 32, children: [] }
        ] },
        { name: '人力资源部', code: 'ZL-01-02', type: '部门', count: 24, children: [
          { name: '薪酬绩效科', code: 'ZL-01-02-01', type: '科室', count: 9, children: [] },
          { name: '员工关系科', code: 'ZL-01-02-02', type: '科室', count: 7, children: [] }
        ] },
        { name: '财务部', code: 'ZL-01-03', type: '部门', count: 36, children: [
          { name: '财务共享中心', code: 'ZL-01-03-01', type: '科室', count: 22, children: [] }
        ] },
        { name: '安全环保部', code: 'ZL-01-04', type: '部门', count: 28, children: [] },
        { name: '技术中心', code: 'ZL-01-05', type: '部门', count: 42, children: [] }
      ] },
      { name: '三叶实业', code: 'ZL-02', type: '子公司', count: 726, children: [
        { name: '化工一厂', code: 'ZL-02-01', type: '生产厂', count: 312, children: [
          { name: '运行三班', code: 'ZL-02-01-03', type: '班组', count: 26, children: [{ name: '值班组', code: 'ZL-02-01-03-01', type: '班组', count: 9, children: [] }] }
        ] },
        { name: '生产运行部', code: 'ZL-02-02', type: '部门', count: 118, children: [] },
        { name: '设备管理部', code: 'ZL-02-03', type: '部门', count: 86, children: [] }
      ] },
      { name: '汇丰石化', code: 'ZL-03', type: '子公司', count: 618, children: [
        { name: '生产厂', code: 'ZL-03-01', type: '生产厂', count: 402, children: [
          { name: '运行一班', code: 'ZL-03-01-01', type: '班组', count: 28, children: [] }
        ] },
        { name: '设备管理部', code: 'ZL-03-02', type: '部门', count: 92, children: [] },
        { name: '安全环保部', code: 'ZL-03-03', type: '部门', count: 38, children: [] }
      ] },
      { name: '翔鑫工贸', code: 'ZL-04', type: '子公司', count: 452, children: [
        { name: '管道运营部', code: 'ZL-04-01', type: '部门', count: 168, children: [] },
        { name: '质量管理部', code: 'ZL-04-02', type: '部门', count: 74, children: [] },
        { name: '综合办公室', code: 'ZL-04-03', type: '部门', count: 32, children: [] }
      ] },
      { name: '维达石化', code: 'ZL-05', type: '子公司', count: 268, children: [
        { name: '工程事业部', code: 'ZL-05-01', type: '部门', count: 132, children: [] },
        { name: '设备管理部', code: 'ZL-05-02', type: '部门', count: 64, children: [] }
      ] },
      { name: '宏达人力', code: 'ZL-06', type: '子公司', count: 246, children: [
        { name: '人力资源部', code: 'ZL-06-01', type: '部门', count: 96, children: [] },
        { name: '业务部', code: 'ZL-06-02', type: '部门', count: 82, children: [] }
      ] },
      { name: '兰达工贸', code: 'ZL-07', type: '子公司', count: 150, children: [
        { name: '工程管理部', code: 'ZL-07-01', type: '部门', count: 88, children: [] },
        { name: '生产运行部', code: 'ZL-07-02', type: '部门', count: 46, children: [] }
      ] }
    ]
  };

  const ORG_CHANGES = [
    { id: 'JG-2026-018', type: '新增', unit: '三叶实业', content: '新增化工一厂运行四班，编制 26 人', date: '2026-10-20', status: '已生效', version: 'V2026.10' },
    { id: 'JG-2026-017', type: '合并', unit: '翔鑫工贸', content: '综合办公室与党群工作部合并为综合管理部', date: '2026-10-15', status: '已生效', version: 'V2026.10' },
    { id: 'JG-2026-016', type: '划转', unit: '维达石化', content: '设备管理部检维修班组整体划转至工程事业部', date: '2026-10-08', status: '审批中', version: 'V2026.11' },
    { id: 'JG-2026-015', type: '撤销', unit: '集团本部', content: '撤销营销部兰州销售科，业务并入营销部大客户科', date: '2026-09-28', status: '已生效', version: 'V2026.09' },
    { id: 'JG-2026-014', type: '新增', unit: '集团本部', content: '技术中心增设新能源材料研究室，编制 12 人', date: '2026-09-15', status: '已生效', version: 'V2026.09' },
    { id: 'JG-2026-013', type: '合并', unit: '宏达人力', content: '业务一部、业务二部合并为业务部', date: '2026-08-20', status: '已生效', version: 'V2026.08' },
    { id: 'JG-2026-012', type: '划转', unit: '兰达工贸', content: '生产运行部管输班组划转至汇丰石化管道运营部', date: '2026-08-01', status: '已生效', version: 'V2026.08' },
    { id: 'JG-2026-011', type: '撤销', unit: '三叶实业', content: '撤销实业经营部下属物业科', date: '2026-07-10', status: '已生效', version: 'V2026.07' }
  ];

  const ORG_CODES = [
    { id: 'C01', object: '集团本部', code: 'ZL-01', rule: '集团 2 位 + 单位 2 位', updated: '2026-01-01' },
    { id: 'C02', object: '三叶实业', code: 'ZL-02', rule: '集团 2 位 + 单位 2 位', updated: '2026-01-01' },
    { id: 'C03', object: '生产运行部', code: 'ZL-01-01', rule: '上级编码 + 2 位部门序号', updated: '2026-01-01' },
    { id: 'C04', object: '化工一厂', code: 'ZL-02-01', rule: '上级编码 + 2 位生产厂序号', updated: '2026-03-15' },
    { id: 'C05', object: '运行三班', code: 'ZL-02-01-03', rule: '上级编码 + 2 位班组序号', updated: '2026-06-01' },
    { id: 'C06', object: '调度值班组', code: 'ZL-01-01-01-01', rule: '五级编码，末级 2 位流水', updated: '2026-08-01' },
    { id: 'C07', object: '财务共享中心', code: 'ZL-01-03-01', rule: '上级编码 + 2 位科室序号', updated: '2026-01-01' },
    { id: 'C08', object: '工程事业部', code: 'ZL-05-01', rule: '上级编码 + 2 位部门序号', updated: '2026-05-20' }
  ];

  const POSITIONS = [
    { id: 'P001', name: '生产调度主管', channel: '管理', series: '生产管理', level: 'M2-3', unit: '集团本部', approved: 8, current: 7, gap: -1, doc: 'V2026.2' },
    { id: 'P002', name: '化工总控工', channel: '技能', series: '化工操作', level: 'S3-2', unit: '三叶实业', approved: 168, current: 172, gap: 4, doc: 'V2026.1' },
    { id: 'P003', name: '设备工程师', channel: '技术', series: '设备管理', level: 'T3-1', unit: '汇丰石化', approved: 36, current: 32, gap: -4, doc: 'V2026.1' },
    { id: 'P004', name: '电气维修工', channel: '技能', series: '电气仪表', level: 'S2-2', unit: '维达石化', approved: 42, current: 40, gap: -2, doc: 'V2025.4' },
    { id: 'P005', name: '安全工程师', channel: '技术', series: '安全环保', level: 'T2-3', unit: '集团本部', approved: 18, current: 15, gap: -3, doc: 'V2026.2' },
    { id: 'P006', name: '管输调度员', channel: '管理', series: '管道运营', level: 'M1-2', unit: '翔鑫工贸', approved: 24, current: 22, gap: -2, doc: 'V2026.1' },
    { id: 'P007', name: '人力资源专员', channel: '管理', series: '人力行政', level: 'M1-1', unit: '宏达人力', approved: 16, current: 18, gap: 2, doc: 'V2026.3' },
    { id: 'P008', name: '财务共享专员', channel: '管理', series: '财务管理', level: 'M1-1', unit: '集团本部', approved: 22, current: 20, gap: -2, doc: 'V2026.1' },
    { id: 'P009', name: '化验员', channel: '技能', series: '质量检验', level: 'S2-1', unit: '翔鑫工贸', approved: 38, current: 36, gap: -2, doc: 'V2026.1' },
    { id: 'P010', name: '焊工', channel: '技能', series: '设备检修', level: 'S2-2', unit: '三叶实业', approved: 26, current: 24, gap: -2, doc: 'V2025.9' },
    { id: 'P011', name: '项目经理', channel: '管理', series: '工程管理', level: 'M2-1', unit: '兰达工贸', approved: 10, current: 9, gap: -1, doc: 'V2026.2' },
    { id: 'P012', name: '工艺工程师', channel: '技术', series: '化工工艺', level: 'T3-2', unit: '集团本部', approved: 20, current: 19, gap: -1, doc: 'V2026.2' }
  ];

  const RANKS = [
    { level: 'M4', name: '集团正职', band: '薪酬档级 24–26', cadre: '集团领导班子', positions: '总经理 / 党委书记', count: 2 },
    { level: 'M3', name: '集团副职', band: '薪酬档级 21–23', cadre: '集团领导班子', positions: '副总经理 / 总工', count: 6 },
    { level: 'M2-3', name: '部门正职', band: '薪酬档级 18–20', cadre: '中层正职', positions: '部长 / 厂长', count: 24 },
    { level: 'M2-2', name: '部门副职', band: '薪酬档级 16–17', cadre: '中层副职', positions: '副部长 / 副厂长', count: 38 },
    { level: 'M2-1', name: '科室正职', band: '薪酬档级 14–15', cadre: '基层管理', positions: '科长 / 主任', count: 56 },
    { level: 'M1-3', name: '主管', band: '薪酬档级 12–13', cadre: '基层管理', positions: '主管 / 值班长', count: 96 },
    { level: 'M1-2', name: '专员（资深）', band: '薪酬档级 10–11', cadre: '—', positions: '资深专员', count: 128 },
    { level: 'T4', name: '技术专家', band: '薪酬档级 19–21', cadre: '技术带头人', positions: '首席工程师', count: 8 },
    { level: 'T3-2', name: '高级工程师', band: '薪酬档级 15–17', cadre: '—', positions: '高级工程师', count: 46 },
    { level: 'T3-1', name: '工程师', band: '薪酬档级 12–14', cadre: '—', positions: '工程师', count: 118 },
    { level: 'S3-2', name: '高级技师', band: '薪酬档级 13–15', cadre: '技能带头人', positions: '高级技师', count: 62 },
    { level: 'S3-1', name: '技师', band: '薪酬档级 11–13', cadre: '—', positions: '技师', count: 148 }
  ];

  /* ---------- 员工异动 ---------- */
  const TRANSFERS = [
    { id: 'YD-2026-109', ...base(10), type: '入职', content: '化工总控工 · 报到办理', date: '2026-10-29', status: '进行中', note: '资料齐全，待建档发证' },
    { id: 'YD-2026-108', ...base(5), type: '转正', content: '人力资源专员 · 待转正考核', date: '2026-10-29', status: '进行中', note: '部门评议中' },
    { id: 'YD-2026-107', ...base(7), type: '调动', content: '生产运行部 → 技术中心', date: '2026-10-29', status: '待审批', note: '集团人资复核' },
    { id: 'YD-2026-106', ...base(13), type: '离职', content: '主动离职 · 离职面谈已完成', date: '2026-10-29', status: '待交接', note: '资产未归还' },
    { id: 'YD-2026-105', ...base(3), type: '入职', content: '财务共享专员 · 待体检', date: '2026-10-28', status: '进行中', note: '体检预约 10-30' },
    { id: 'YD-2026-104', ...base(8), type: '转正', content: '管输调度员 · 转正考核通过', date: '2026-10-28', status: '已通过', note: '11-01 生效' },
    { id: 'YD-2026-103', ...base(6), type: '调动', content: '三叶实业 → 集团本部（借调 1 年）', date: '2026-10-28', status: '已生效', note: '薪酬由集团承担' },
    { id: 'YD-2026-102', ...base(11), type: '离职', content: '合同到期不续签 · 待资产归还', date: '2026-10-28', status: '待确认', note: '交接完成 80%' },
    { id: 'YD-2026-101', ...base(2), type: '调动', content: '车间 → 班组（轮岗 6 个月）', date: '2026-10-27', status: '已生效', note: '纳入轮岗计划' },
    { id: 'YD-2026-100', ...base(12), type: '转正', content: '化验员 · 试用期提前转正', date: '2026-10-27', status: '已通过', note: '考核 92 分' }
  ];

  const DUTY_CHANGES = [
    { id: 'ZW-2026-041', ...base(0), type: '晋升', from: '调度员', to: '生产调度主管', date: '2026-11-01', status: '待生效', note: '集团党委会已通过' },
    { id: 'ZW-2026-040', ...base(2), type: '晋升', from: '设备工程师', to: '设备管理部副部长', date: '2026-10-20', status: '已生效', note: '考察期 6 个月' },
    { id: 'ZW-2026-039', ...base(9), type: '降级', from: '安全员', to: '安全环保部安全员（降一档）', date: '2026-10-15', status: '已生效', note: '连续两年考核 C' },
    { id: 'ZW-2026-038', ...base(5), type: '免职', from: '质量管理部主管', to: '化验员', date: '2026-09-30', status: '已生效', note: '机构调整' },
    { id: 'ZW-2026-037', ...base(11), type: '退休', from: '工艺工程师', to: '退休返聘', date: '2026-09-01', status: '已办结', note: '返聘协议 2 年' },
    { id: 'ZW-2026-036', ...base(7), type: '退休', from: '电气维修工', to: '退休', date: '2026-08-15', status: '已办结', note: '特殊工种提前退休' },
    { id: 'ZW-2026-035', ...base(13), type: '晋升', from: '值班长', to: '生产运行部副部长', date: '2026-08-01', status: '已生效', note: '民主推荐第一' },
    { id: 'ZW-2026-034', ...base(4), type: '免职', from: '值班长', to: '化工操作工', date: '2026-07-20', status: '已生效', note: '竞聘落选' }
  ];

  /* ---------- 工龄 ---------- */
  const SENIORITY = E.map((x, i) => ({
    empNo: x.no, name: x.name, unit: x.unit, dept: x.dept, hireDate: x.hireDate,
    continuous: (18 - (i % 5) * 2 + i * 0.2).toFixed(1),
    company: x.seniority.replace(' 年', ''),
    social: String(16 + (i % 6) * 2),
    deemed: i % 3 === 0 ? String(2 + (i % 4)) : '0',
    special: i % 4 === 1 ? (1 + (i % 3)) : '0',
    status: i % 5 === 0 ? '待认定' : '已认定'
  }));

  const SENIORITY_VERIFY = [
    { id: 'GR-2026-021', ...base(0), type: '军龄', years: 3, evidence: '退伍证、入伍登记表', status: '已认定', date: '2026-10-12' },
    { id: 'GR-2026-020', ...base(4), type: '原单位年限', years: 5, evidence: '原单位劳动合同、社保记录', status: '已认定', date: '2026-10-08' },
    { id: 'GR-2026-019', ...base(6), type: '上山下乡', years: 2, evidence: '知青档案、户籍迁移记录', status: '待补充', date: '2026-09-26' },
    { id: 'GR-2026-018', ...base(2), type: '军龄', years: 4, evidence: '退伍证', status: '已认定', date: '2026-09-18' },
    { id: 'GR-2026-017', ...base(8), type: '原单位年限', years: 3, evidence: '原单位离职证明', status: '待认定', date: '2026-09-10' },
    { id: 'GR-2026-016', ...base(10), type: '军龄', years: 2, evidence: '退伍证、优待证', status: '已认定', date: '2026-08-30' },
    { id: 'GR-2026-015', ...base(12), type: '上山下乡', years: 3, evidence: '知青办证明', status: '已认定', date: '2026-08-18' },
    { id: 'GR-2026-014', ...base(1), type: '原单位年限', years: 6, evidence: '社保缴费记录', status: '已认定', date: '2026-08-05' }
  ];

  const SPECIAL_WORK = [
    { id: 'TS-01', name: '张伟', post: '调度员', type: '有毒有害', years: 8, factor: '1.5', result: '折算 12 年', retire: '男 55 岁', status: '符合' },
    { id: 'TS-02', name: '陈立', post: '值班长', type: '高温', years: 10, factor: '1.3', result: '折算 13 年', retire: '男 55 岁', status: '符合' },
    { id: 'TS-03', name: '吴磊', post: '化工操作工', type: '有毒有害', years: 6, factor: '1.5', result: '折算 9 年', retire: '男 55 岁', status: '累计中' },
    { id: 'TS-04', name: '周鹏', post: '电气维修工', type: '高空', years: 7, factor: '1.2', result: '折算 8.4 年', retire: '男 55 岁', status: '累计中' },
    { id: 'TS-05', name: '徐涛', post: '值班长', type: '井下', years: 4, factor: '1.5', result: '折算 6 年', retire: '男 55 岁', status: '累计中' },
    { id: 'TS-06', name: '王强', post: '设备工程师', type: '高温', years: 12, factor: '1.3', result: '折算 15.6 年', retire: '男 55 岁', status: '符合' },
    { id: 'TS-07', name: '马超', post: '焊工', type: '有毒有害', years: 2, factor: '1.5', result: '折算 3 年', retire: '—', status: '累计中' },
    { id: 'TS-08', name: '黄磊', post: '工艺工程师', type: '高温', years: 15, factor: '1.3', result: '折算 19.5 年', retire: '男 55 岁', status: '符合' }
  ];

  const SENIORITY_APPLY = E.slice(0, 12).map((x, i) => ({
    empNo: x.no, name: x.name, years: Number(x.seniority.replace(' 年', '')),
    wage: 300 + (Number(x.seniority.replace(' 年', '')) * 20),
    annualLeave: Number(x.seniority.replace(' 年', '')) >= 20 ? 15 : Number(x.seniority.replace(' 年', '')) >= 10 ? 10 : 5,
    retire: Number(x.seniority.replace(' 年', '')) >= 20 ? '可申请内退' : '正常退休',
    honor: Number(x.seniority.replace(' 年', '')) >= 20 ? '符合 30 年荣誉' : '—'
  }));

  /* ---------- 合同 ---------- */
  const CONTRACTS = E.map((x, i) => {
    const type = i % 6 === 0 ? '无固定期限' : i % 5 === 1 ? '劳务派遣协议' : '固定期限';
    const end = ['2026-11-20', '2026-12-31', '2027-04-09', '2027-08-15', '2028-03-31', '2028-12-31', '2029-06-30'][i % 7];
    const days = Math.round((new Date(end) - new Date('2026-10-29')) / 86400000);
    return {
      id: 'HT-' + (2026 - (i % 3)) + '-' + String(101 + i), empNo: x.no, name: x.name, unit: x.unit, dept: x.dept,
      type, start: ['2023-11-20', '2024-01-01', '2025-04-09', '2024-08-15', '2025-07-01', '2025-12-31', '2026-06-30'][i % 7],
      end, days, status: days < 0 ? '已到期' : days <= 30 ? '待续签' : '履行中', renew: i % 4 === 0 ? '第 2 次续签' : '首次签订'
    };
  });

  const CONTRACT_CHANGES = [
    { id: 'HT-2026-031', name: '李静', type: '续签', content: '固定期限续签 3 年，薪资标准随岗位调整', date: '2026-10-28', status: '已办结' },
    { id: 'HT-2026-030', name: '何欣', type: '终止', content: '合同到期不续签，支付经济补偿 0 元（员工主动）', date: '2026-10-20', status: '已办结' },
    { id: 'HT-2026-029', name: '王强', type: '变更', content: '岗位调整为设备管理部副部长，薪资档级上调 2 档', date: '2026-10-15', status: '已生效' },
    { id: 'HT-2026-028', name: '周鹏', type: '解除', content: '协商解除劳动合同，补偿 N+1 计 14 个月', date: '2026-10-08', status: '审批中' },
    { id: 'HT-2026-027', name: '刘婷', type: '续签', content: '无固定期限合同签订', date: '2026-09-30', status: '已办结' },
    { id: 'HT-2026-026', name: '黄磊', type: '变更', content: '返聘协议变更为 1 年一签', date: '2026-09-18', status: '已生效' },
    { id: 'HT-2026-025', name: '马超', type: '解除', content: '实习协议提前解除', date: '2026-09-05', status: '已办结' },
    { id: 'HT-2026-024', name: '赵敏', type: '续签', content: '固定期限续签 5 年', date: '2026-08-20', status: '已办结' }
  ];

  const AGREEMENTS = [
    { id: 'XY-2026-012', name: '张伟', type: '保密协议', sign: '2026-01-05', end: '2029-01-04', status: '履行中' },
    { id: 'XY-2026-011', name: '王强', type: '竞业限制协议', sign: '2026-03-01', end: '2028-02-28', status: '履行中' },
    { id: 'XY-2026-010', name: '李静', type: '培训服务期协议', sign: '2026-06-10', end: '2031-06-09', status: '履行中' },
    { id: 'XY-2026-009', name: '黄磊', type: '保密协议', sign: '2026-01-04', end: '2028-01-03', status: '履行中' },
    { id: 'XY-2026-008', name: '陈立', type: '竞业限制协议', sign: '2025-09-01', end: '2027-08-31', status: '即将到期' },
    { id: 'XY-2026-007', name: '赵敏', type: '培训服务期协议', sign: '2025-07-15', end: '2030-07-14', status: '履行中' },
    { id: 'XY-2026-006', name: '周鹏', type: '保密协议', sign: '2025-05-06', end: '2028-05-05', status: '履行中' },
    { id: 'XY-2026-005', name: '孙慧', type: '培训服务期协议', sign: '2024-01-05', end: '2029-01-04', status: '履行中' },
    { id: 'XY-2026-004', name: '徐涛', type: '竞业限制协议', sign: '2026-07-01', end: '2028-06-30', status: '履行中' },
    { id: 'XY-2026-003', name: '吴磊', type: '保密协议', sign: '2026-10-01', end: '2029-09-30', status: '履行中' }
  ];

  const DISPUTES = [
    { id: 'ZD-2026-006', name: '周鹏', type: '经济补偿争议', stage: '调解', date: '2026-10-20', status: '调解中', owner: '李静' },
    { id: 'ZD-2026-005', name: '何欣', type: '离职证明争议', stage: '协商', date: '2026-10-08', status: '已和解', owner: '孙慧' },
    { id: 'ZD-2026-004', name: '马超', type: '实习报酬争议', stage: '调解', date: '2026-09-15', status: '已办结', owner: '李静' },
    { id: 'ZD-2026-003', name: '吴磊', type: '加班费争议', stage: '仲裁', date: '2026-08-30', status: '仲裁中', owner: '孙慧' },
    { id: 'ZD-2026-002', name: '陈立', type: '岗位调整争议', stage: '协商', date: '2026-07-18', status: '已和解', owner: '王芳' },
    { id: 'ZD-2026-001', name: '刘婷', type: '工伤待遇争议', stage: '诉讼', date: '2026-06-10', status: '审理中', owner: '李静' }
  ];

  /* ---------- 招聘 ---------- */
  const DEMANDS = [
    { id: 'ZLZP-2026-042', company: '三叶实业', department: '生产运行部', position: '化工总控工', headcount: 12, hired: 0, education: '大专及以上', certificate: '化工总控工（中级）', experience: '3 年以上石化装置操作', status: '已审批', employment: '正式工', salary: '6,500–9,000 元', location: '兰州西固' },
    { id: 'ZLZP-2026-043', company: '汇丰石化', department: '设备管理部', position: '设备工程师', headcount: 5, hired: 0, education: '本科及以上', certificate: '注册设备监理师优先', experience: '5 年以上动设备管理', status: '招聘中', employment: '正式工', salary: '9,000–12,000 元', location: '兰州西固' },
    { id: 'ZLZP-2026-044', company: '翔鑫工贸', department: '管道运营部', position: '管输调度员', headcount: 6, hired: 2, education: '本科及以上', certificate: '—', experience: '3 年以上管输调度', status: '招聘中', employment: '正式工', salary: '7,000–9,500 元', location: '兰州新区' },
    { id: 'ZLZP-2026-045', company: '维达石化', department: '工程事业部', position: '检维修技师', headcount: 8, hired: 3, education: '中专及以上', certificate: '高级工 / 焊工证', experience: '5 年以上化工设备维保', status: '已审批', employment: '正式工', salary: '8,000–10,000 元', location: '兰州西固' },
    { id: 'ZLZP-2026-046', company: '宏达人力', department: '业务部', position: '人力资源专员', headcount: 3, hired: 0, education: '本科及以上', certificate: '人力资源管理师三级', experience: '2 年以上 HR 实务', status: '待审批', employment: '劳务派遣', salary: '5,500–7,000 元', location: '兰州城关' },
    { id: 'ZLZP-2026-047', company: '兰达工贸', department: '工程管理部', position: '项目经理', headcount: 2, hired: 0, education: '本科及以上', certificate: '一级建造师（机电）', experience: '8 年以上工程管理', status: '待审批', employment: '正式工', salary: '12,000–15,000 元', location: '兰州新区' },
    { id: 'ZLZP-2026-048', company: '集团本部', department: '安全环保部', position: '安全工程师', headcount: 4, hired: 1, education: '本科及以上', certificate: '注册安全工程师', experience: '5 年以上化工安全', status: '已到岗 1 人', employment: '正式工', salary: '10,000–13,000 元', location: '兰州西固' },
    { id: 'ZLZP-2026-049', company: '集团本部', department: '财务部', position: '财务共享专员', headcount: 2, hired: 1, education: '本科及以上', certificate: '中级会计师', experience: '3 年以上总账经验', status: '招聘中', employment: '正式工', salary: '7,500–9,000 元', location: '兰州城关' }
  ];

  const CANDIDATES = [
    { id: 'RC-001', name: '张一帆', phone: '138****6621', position: '化工总控工', education: '大专 · 兰州石化职业技术学院', years: 6, score: 82, channel: 'BOSS直聘', status: '待面试' },
    { id: 'RC-002', name: '李明轩', phone: '139****3378', position: '设备工程师', education: '本科 · 兰州理工大学', years: 8, score: 88, channel: 'BOSS直聘', status: '已初筛' },
    { id: 'RC-003', name: '王思远', phone: '136****9024', position: '安全工程师', education: '本科 · 中国石油大学（华东）', years: 5, score: 91, channel: '智联招聘', status: '待面试' },
    { id: 'RC-004', name: '陈嘉怡', phone: '137****5510', position: '财务共享专员', education: '本科 · 兰州财经大学', years: 3, score: 86, channel: '智联招聘', status: '已初筛' },
    { id: 'RC-005', name: '郭子涵', phone: '135****8832', position: '化验员', education: '大专 · 兰州石化职业技术学院', years: 4, score: 78, channel: '前程无忧', status: '待初筛' },
    { id: 'RC-006', name: '周雨萱', phone: '133****2145', position: '人力资源专员', education: '本科 · 西北师范大学', years: 2, score: 84, channel: '前程无忧', status: '待面试' },
    { id: 'RC-007', name: '赵天成', phone: '186****4432', position: '检维修技师', education: '中专 · 兰州装备制造技师学院', years: 9, score: 90, channel: '集团招聘网站', status: '待面试' },
    { id: 'RC-008', name: '钱思琪', phone: '188****7719', position: '管输调度员', education: '本科 · 中国石油大学（华东）', years: 4, score: 88, channel: '校园招聘', status: '已初筛' }
  ];

  const EVALUATIONS = [
    { id: 'EV-01', name: '张一帆', type: '笔试', detail: '化工基础 + 安全知识', result: '82 分', status: '已通过', date: '2026-10-26' },
    { id: 'EV-02', name: '李明轩', type: '面试', detail: '结构化面试 · 3 位考官', result: '88.5 分', status: '待安排', date: '2026-10-30' },
    { id: 'EV-03', name: '王思远', type: '背景调查', detail: '前单位履历与证书核实', result: '无异常', status: '进行中', date: '2026-10-28' },
    { id: 'EV-04', name: '陈嘉怡', type: '体检', detail: '西固区医院入职体检', result: '合格', status: '已完成', date: '2026-10-24' },
    { id: 'EV-05', name: '郭子涵', type: '面试', detail: '部门负责人复试', result: '拟 10-30 进行', status: '待安排', date: '2026-10-30' },
    { id: 'EV-06', name: '周雨萱', type: '笔试', detail: '人力资源专业知识', result: '76 分', status: '已通过', date: '2026-10-27' }
  ];

  const OFFERS = [
    { id: 'OF-01', name: '张一帆', position: '化工总控工', unit: '三叶实业', period: '10-28 ~ 11-03', status: '公示中' },
    { id: 'OF-02', name: '李明轩', position: '设备工程师', unit: '汇丰石化', period: '10-27 ~ 11-02', status: '公示中' },
    { id: 'OF-03', name: '王思远', position: '安全工程师', unit: '集团本部', period: '10-25 ~ 10-31', status: '已通过' },
    { id: 'OF-04', name: '陈嘉怡', position: '财务共享专员', unit: '集团本部', period: '10-24 ~ 10-30', status: '已通过' },
    { id: 'OF-05', name: '郭子涵', position: '化验员', unit: '三叶实业', period: '11-01 ~ 11-07', status: '待公示' },
    { id: 'OF-06', name: '周雨萱', position: '人力资源专员', unit: '集团本部', period: '待发布', status: '待审批' }
  ];

  const RECRUIT_TYPES = [
    { id: 'RT-01', type: '校园招聘平台', plan: '12 人', progress: '已完成 8 人', channel: '兰州石化职院 / 兰州理工 / 高校就业平台', status: '进行中' },
    { id: 'RT-02', type: '内部公开招聘平台', plan: '6 人', progress: '笔试完成 4 人', channel: '集团内部人才市场', status: '进行中' },
    { id: 'RT-03', type: '社会化招聘平台', plan: '26 人', progress: '已完成 10 人', channel: 'BOSS直聘 / 智联 / 前程无忧接口抓取', status: '进行中' },
    { id: 'RT-04', type: '猎头寻访', plan: '3 人', progress: '洽谈 1 人', channel: '新材料 / 高层次人才寻访', status: '进行中' },
    { id: 'RT-05', type: '退役军人安置', plan: '4 人', progress: '已到岗 2 人', channel: '兰州市退役军人事务局', status: '进行中' },
    { id: 'RT-06', type: '劳务协作', plan: '8 人', progress: '已到岗 5 人', channel: '宏达人力', status: '进行中' }
  ];

  const GRADUATE_DEFENSE = [
    { id: 'JX-2026-021', name: '张一帆', school: '兰州石化职业技术学院', major: '化工工艺', post: '三叶实业 · 化工总控工', stage: '材料上传', score: '—', defense: '待安排', publish: '—', status: '进行中', proof: '未生成' },
    { id: 'JX-2026-020', name: '李明轩', school: '兰州理工大学', major: '机械设计制造', post: '汇丰石化 · 设备工程师', stage: '专家评分', score: '86.5', defense: '待安排', publish: '—', status: '进行中', proof: '未生成' },
    { id: 'JX-2026-019', name: '王思远', school: '中国石油大学（华东）', major: '安全工程', post: '集团本部 · 安全工程师', stage: '答辩考核', score: '91.0', defense: '已完成', publish: '待公示', status: '进行中', proof: '未生成' },
    { id: 'JX-2026-018', name: '陈嘉怡', school: '兰州财经大学', major: '会计学', post: '集团本部 · 财务共享专员', stage: '结果公示', score: '88.0', defense: '已完成', publish: '10-27 起 7 天', status: '公示中', proof: '未生成' },
    { id: 'JX-2026-017', name: '郭子涵', school: '兰州石化职业技术学院', major: '工业分析', post: '三叶实业 · 化验员', stage: '结果公示', score: '84.5', defense: '已完成', publish: '10-26 起 7 天', status: '公示中', proof: '未生成' },
    { id: 'JX-2026-016', name: '周雨萱', school: '西北师范大学', major: '人力资源管理', post: '集团本部 · 人力资源专员', stage: '已定级', score: '87.5', defense: '已完成', publish: '已公示', status: '已完成', proof: '已发放' },
    { id: 'JX-2026-015', name: '赵天成', school: '兰州装备制造技师学院', major: '焊接技术', post: '维达石化 · 检维修技师', stage: '已定级', score: '90.0', defense: '已完成', publish: '已公示', status: '已完成', proof: '已发放' }
  ];

  /* ---------- 考勤 ---------- */
  const SHIFTS = [
    { id: 'S1', name: '四班三运转 · 甲班', nature: '三班倒', time: '08:00–16:00', team: '运行一班', allowance: '25 元 / 班', cycle: '8 天循环', status: '执行中' },
    { id: 'S2', name: '四班三运转 · 中班', nature: '三班倒', time: '16:00–24:00', team: '运行二班', allowance: '40 元 / 班', cycle: '8 天循环', status: '执行中' },
    { id: 'S3', name: '四班三运转 · 夜班', nature: '三班倒', time: '00:00–08:00', team: '运行三班', allowance: '60 元 / 班', cycle: '8 天循环', status: '执行中' },
    { id: 'S4', name: '五班三运转 · 夜班', nature: '三班倒', time: '22:00–06:00', team: '运行四班', allowance: '60 元 / 班', cycle: '10 天循环', status: '执行中' },
    { id: 'S5', name: '常白班', nature: '常白班', time: '08:30–17:30', team: '机关 / 技术', allowance: '不计津贴', cycle: '每周 5 天', status: '执行中' },
    { id: 'S6', name: '节假日加班', nature: '节假日', time: '全天（8 小时）', team: '运行一班', allowance: '200 元 / 班', cycle: '法定节假日', status: '待审批' }
  ];

  const SHIFT_MATRIX = {
    groups: ['运行一班', '运行二班', '运行三班', '运行四班'],
    days: ['周一 11-02', '周二 11-03', '周三 11-04', '周四 11-05', '周五 11-06', '周六 11-07', '周日 11-08'],
    cells: [
      ['甲班', '甲班', '中班', '中班', '夜班', '休', '休'],
      ['中班', '中班', '夜班', '夜班', '甲班', '休', '休'],
      ['夜班', '夜班', '甲班', '甲班', '中班', '休', '休'],
      ['休', '甲班', '甲班', '中班', '中班', '夜班', '休']
    ]
  };

  const DUTY_ROSTER = [
    { id: 'D1', name: '张伟', unit: '集团本部', dept: '生产运行部', title: '调度主管 · 高级工程师', area: '全厂生产调度', duty: '生产异常处置、跨装置协调、外协联络', date: '10-30 全天' },
    { id: 'D2', name: '王强', unit: '汇丰石化', dept: '设备管理部', title: '设备工程师 · 工程师（中级）', area: '一期 / 二期动设备区', duty: '动设备巡检、抢修协调、备件领用审批', date: '10-31 全天' },
    { id: 'D3', name: '郑霞', unit: '汇丰石化', dept: '安全环保部', title: '安全主管 · 注册安全工程师', area: '全厂安全环保', duty: '隐患排查、应急响应、承包商监督', date: '11-01 全天' },
    { id: 'D4', name: '周鹏', unit: '维达石化', dept: '设备管理部', title: '仪表班长 · 技师（二级）', area: '中央控制室', duty: 'DCS 监控、仪表故障处理、联锁投用', date: '11-02 全天' },
    { id: 'D5', name: '赵天成', unit: '维达石化', dept: '工程事业部', title: '检维修技师 · 高级工（三级）', area: '检维修作业区', duty: '作业票审批、检修验收、现场监护', date: '11-03 全天' }
  ];

  const ATTENDANCE = E.map((x, i) => ({
    empNo: x.no, name: x.name, unit: x.unit, dept: x.dept,
    workDays: 21, actual: 20 - (i % 3), late: i % 4 === 0 ? 2 : 0, early: i % 5 === 0 ? 1 : 0,
    missing: i % 7 === 0 ? 2 : 0, leave: i % 6 === 0 ? 1 : 0, overtime: 8 + (i % 5) * 4,
    status: i % 7 === 0 ? '异常待处理' : '正常'
  }));

  const ATT_EXCEPTIONS = [
    { id: 'KQ-2026-1021', name: '张伟', date: '2026-10-28', type: '漏打卡', detail: '下班未打卡（门禁无记录）', status: '待补卡审批', owner: '李静' },
    { id: 'KQ-2026-1020', name: '周鹏', date: '2026-10-27', type: '迟到', detail: '迟到 18 分钟（交通管制）', status: '已申诉通过', owner: '王芳' },
    { id: 'KQ-2026-1019', name: '吴磊', date: '2026-10-26', type: '早退', detail: '早退 32 分钟，未提交说明', status: '待说明', owner: '陈立' },
    { id: 'KQ-2026-1018', name: '刘婷', date: '2026-10-25', type: '漏打卡', detail: '上班未打卡（人脸识别失败）', status: '已补卡', owner: '李静' },
    { id: 'KQ-2026-1017', name: '马超', date: '2026-10-24', type: '漏打卡', detail: '夜班交接未打卡', status: '待补卡审批', owner: '陈立' },
    { id: 'KQ-2026-1016', name: '孙慧', date: '2026-10-23', type: '迟到', detail: '迟到 6 分钟', status: '已申诉通过', owner: '王芳' },
    { id: 'KQ-2026-1015', name: '徐涛', date: '2026-10-22', type: '早退', detail: '早退 15 分钟（设备抢修）', status: '已确认公出', owner: '张伟' },
    { id: 'KQ-2026-1014', name: '郑霞', date: '2026-10-21', type: '漏打卡', detail: '外勤检查未打卡', status: '已补卡', owner: '李静' }
  ];

  const LEAVE_BALANCE = E.slice(0, 12).map((x, i) => ({
    empNo: x.no, name: x.name, unit: x.unit,
    annual: Number(x.seniority.replace(' 年', '')) >= 20 ? 15 : Number(x.seniority.replace(' 年', '')) >= 10 ? 10 : 5,
    used: 4 + (i % 5), remain: (Number(x.seniority.replace(' 年', '')) >= 20 ? 15 : Number(x.seniority.replace(' 年', '')) >= 10 ? 10 : 5) - (4 + (i % 5)),
    sick: i % 3, affair: i % 2, comp: 2 + (i % 4), carry: i % 4 === 0 ? 3 : 0
  }));

  const LEAVE_RECORDS = [
    { id: 'QJ-2026-118', name: '张伟', type: '年休假', start: '2026-10-26', days: 3, status: '已审批', owner: '王芳' },
    { id: 'QJ-2026-117', name: '刘婷', type: '病假', start: '2026-10-24', days: 2, status: '已审批', owner: '郑霞' },
    { id: 'QJ-2026-116', name: '陈立', type: '探亲假', start: '2026-10-20', days: 5, status: '已审批', owner: '王强' },
    { id: 'QJ-2026-115', name: '赵敏', type: '婚假', start: '2026-10-18', days: 10, status: '已审批', owner: '王军' },
    { id: 'QJ-2026-114', name: '吴磊', type: '调休', start: '2026-10-15', days: 1, status: '已审批', owner: '陈立' },
    { id: 'QJ-2026-113', name: '孙慧', type: '产假', start: '2026-10-01', days: 158, status: '已审批', owner: '李静' },
    { id: 'QJ-2026-112', name: '马超', type: '工伤假', start: '2026-09-20', days: 15, status: '已审批', owner: '郑霞' },
    { id: 'QJ-2026-111', name: '徐涛', type: '陪产假', start: '2026-09-10', days: 15, status: '已审批', owner: '陈立' }
  ];

  const OVERTIME = [
    { id: 'JB-2026-092', name: '张伟', date: '2026-10-28', type: '延时加班', hours: 4, reason: '装置检修调度', status: '已审批', pay: '调休' },
    { id: 'JB-2026-091', name: '陈立', date: '2026-10-27', type: '休息日加班', hours: 8, reason: '抢修现场协调', status: '已审批', pay: '加班费' },
    { id: 'JB-2026-090', name: '周鹏', date: '2026-10-26', type: '延时加班', hours: 3, reason: '电气故障处理', status: '已审批', pay: '加班费' },
    { id: 'JB-2026-089', name: '吴磊', date: '2026-10-25', type: '法定节假日加班', hours: 8, reason: '节假日值班', status: '已审批', pay: '加班费' },
    { id: 'JB-2026-088', name: '刘婷', date: '2026-10-24', type: '延时加班', hours: 2, reason: '样品复检', status: '待审批', pay: '调休' },
    { id: 'JB-2026-087', name: '王强', date: '2026-10-22', type: '休息日加班', hours: 6, reason: '设备验收', status: '已审批', pay: '调休' },
    { id: 'JB-2026-086', name: '徐涛', date: '2026-10-20', type: '延时加班', hours: 4, reason: '夜班交接延长', status: '已审批', pay: '加班费' },
    { id: 'JB-2026-085', name: '郑霞', date: '2026-10-18', type: '法定节假日加班', hours: 8, reason: '安全检查值守', status: '已审批', pay: '加班费' }
  ];

  /* ---------- 薪酬 ---------- */
  const SAL_STANDARDS = [
    { level: '正高级职称', v: [12600, 13400, 14600, 16200, 17600] },
    { level: '副高级职称', v: [10200, 11000, 12000, 13300, 14500] },
    { level: '中级职称', v: [8400, 9100, 9900, 10900, 11800] },
    { level: '助理级 / 员级', v: [6800, 7300, 7900, 8600, 9200] },
    { level: '高级技师', v: [7600, 8200, 8900, 9700, 10500] },
    { level: '技师', v: [6900, 7400, 8000, 8700, 9400] },
    { level: '高级工', v: [6100, 6500, 7000, 7600, 8200] },
    { level: '中级工 / 初级工', v: [5400, 5700, 6100, 6600, 7100] }
  ];

  const SAL_STRUCTURE = [
    { name: '基本薪酬', formula: '职称 / 技能等级 × 工龄档', note: '集团统一标准，子公司可在区间内浮动' },
    { name: '加班工资', formula: '时薪 × 倍数 × 小时', note: '工作日 150% / 休息日 200% / 法定节假日 300%' },
    { name: '特殊班次津贴', formula: '班次标准 × 班次数量', note: '夜班 60 / 中班 40 / 倒班 25 / 节假日值班 200 元每班' },
    { name: '绩效工资', formula: '基本薪酬 × 20% × 绩效系数', note: 'A 1.3 / B 1.1 / C 1.0 / D 0.7' },
    { name: '其他津补贴', formula: '按标准核定', note: '高温、有毒有害、艰苦岗位、交通通讯' }
  ];

  const PAYROLL = E.map((x, i) => {
    const basic = [12000, 9900, 12000, 7900, 7000, 9100, 6500, 6500, 6100, 8400, 5400, 13300, 7000, 9900][i] || 7000;
    const overtime = [1655, 0, 897, 0, 897, 0, 0, 480, 897, 0, 0, 0, 0, 448][i] || 0;
    const shift = [480, 240, 480, 0, 480, 240, 0, 480, 480, 240, 0, 0, 0, 480][i] || 0;
    const perf = Math.round(basic * 0.2 * ([1.15, 1.05, 1.1, 1.0, 1.15, 1.05, 0.9, 1.1, 1.0, 1.15, 0.9, 1.1, 1.0, 1.05][i] || 1.05));
    const gross = basic + overtime + shift + perf;
    const deduct = Math.round(gross * ([0.177, 0.13, 0.16, 0.11, 0.15, 0.13, 0.1, 0.12, 0.11, 0.16, 0.08, 0.18, 0.1, 0.14][i] || 0.12));
    return {
      empNo: x.no, name: x.name, unit: x.unit, dept: x.dept, basic, overtime, shift, perf,
      gross, deduct, net: gross - deduct, status: i < 10 ? '已核算' : '待复核'
    };
  });

  const SAL_STEPS = [
    { num: 1, title: '子公司 · 人资', desc: '编制月度薪酬表\n汇总考勤 / 绩效 / 班次，按集团标准试算', state: 'done' },
    { num: 2, title: '子公司 · 财务', desc: '审核与预算校验\n核对人工成本预算、资金计划与个税', state: 'done' },
    { num: 3, title: '集团 · 人资', desc: '规则与额度复核\n校验薪酬标准一致性、编制与总额度', state: 'done' },
    { num: 4, title: '集团 · 财务', desc: '会签审批\n会签通过后生成带签章文件，锁定金额', state: 'active' },
    { num: 5, title: '集团 · 人资', desc: '返还会签文件\n将会签文件下发子公司财务', state: '' },
    { num: 6, title: '子公司 · 财务', desc: '入账与发放\n银行代发、生成凭证并归档', state: '' }
  ];

  const SAL_RECORDS = [
    { step: '① 子公司人资 · 编制上报', user: '李静 / 人力资源专员', time: '10-26 10:20', result: '已提交', tag: 'blue' },
    { step: '② 子公司财务 · 审核', user: '王强 / 财务主管', time: '10-26 15:40', result: '通过', tag: 'green' },
    { step: '③ 集团人资 · 复核', user: '张伟 / 薪酬经理', time: '10-27 09:10', result: '通过', tag: 'green' },
    { step: '④ 集团财务 · 会签', user: '赵敏 / 财务共享中心', time: '10-27 16:30', result: '已会签', tag: 'purple' },
    { step: '⑤ 集团人资 · 返还', user: '张伟 / 薪酬经理', time: '10-28 09:05', result: '已下发', tag: 'orange' },
    { step: '⑥ 子公司财务 · 发放归档', user: '王强 / 财务主管', time: '10-28 14:00', result: '已归档', tag: 'green' }
  ];

  const SAL_ADJUST = [
    { id: 'TJ-2026-038', name: '张伟', type: '晋升调薪', before: '12,600', after: '13,400', date: '2026-11-01', status: '待生效' },
    { id: 'TJ-2026-037', name: '王强', type: '岗位变动调薪', before: '11,000', after: '12,000', date: '2026-10-20', status: '已生效' },
    { id: 'TJ-2026-036', name: '李静', type: '年度调薪', before: '9,100', after: '9,900', date: '2026-10-01', status: '已生效' },
    { id: 'TJ-2026-035', name: '赵敏', type: '年度调薪', before: '7,900', after: '8,400', date: '2026-10-01', status: '已生效' },
    { id: 'TJ-2026-034', name: '周鹏', type: '技能等级调薪', before: '6,500', after: '7,000', date: '2026-09-01', status: '已生效' },
    { id: 'TJ-2026-033', name: '刘婷', type: '晋升调薪', before: '6,100', after: '6,500', date: '2026-08-01', status: '已生效' },
    { id: 'TJ-2026-032', name: '陈立', type: '年度调薪', before: '7,300', after: '7,900', date: '2026-07-01', status: '已生效' },
    { id: 'TJ-2026-031', name: '吴磊', type: '转正调薪', before: '5,400', after: '5,700', date: '2026-06-01', status: '已生效' }
  ];

  const BONUS = [
    { id: 'JJ-2026-012', name: '张伟', type: '年终奖', amount: '32,400', period: '2025 年度', status: '已发放' },
    { id: 'JJ-2026-011', name: '王强', type: '效益奖', amount: '18,600', period: '2026 三季度', status: '已发放' },
    { id: 'JJ-2026-010', name: '陈立', type: '安全奖', amount: '8,000', period: '2026 三季度', status: '待发放' },
    { id: 'JJ-2026-009', name: '郑霞', type: '安全奖', amount: '10,000', period: '2026 三季度', status: '待发放' },
    { id: 'JJ-2026-008', name: '李静', type: '专项奖', amount: '6,000', period: '招聘专项', status: '已发放' },
    { id: 'JJ-2026-007', name: '赵敏', type: '效益奖', amount: '9,500', period: '2026 三季度', status: '已发放' }
  ];

  const COST_STRUCT = [
    { name: '工资及奖金', pct: 58, amount: '1.067 亿元', color: '#7055df' },
    { name: '社保公积金', pct: 18, amount: '3,312 万元', color: '#4389ed' },
    { name: '绩效奖励', pct: 12, amount: '2,208 万元', color: '#14a58b' },
    { name: '福利费', pct: 7, amount: '1,288 万元', color: '#e5a22a' },
    { name: '培训及其他', pct: 5, amount: '920 万元', color: '#eb6262' }
  ];

  /* ---------- 福利 ---------- */
  const INS_TYPES = [
    { name: '养老保险', people: '2,846 人', unit: '16%', person: '8%', base: '6,800', color: '#7055df' },
    { name: '医疗保险', people: '2,846 人', unit: '8%', person: '2%', base: '6,800', color: '#4389ed' },
    { name: '失业保险', people: '2,846 人', unit: '0.7%', person: '0.3%', base: '6,800', color: '#14a58b' },
    { name: '工伤保险', people: '2,846 人', unit: '0.5%', person: '不缴', base: '6,800', color: '#e5a22a' },
    { name: '生育保险', people: '2,846 人', unit: '0.8%', person: '不缴', base: '6,800', color: '#eb6262' },
    { name: '住房公积金', people: '2,792 人', unit: '12%', person: '12%', base: '6,800', color: '#7a62f3' }
  ];

  const INS_CHANGES = [
    { id: 'SB-2026-112', name: '马超', type: '新增参保', unit: '三叶实业', date: '2026-10-26', status: '已申报' },
    { id: 'SB-2026-111', name: '何欣', type: '减少参保', unit: '翔鑫工贸', date: '2026-10-09', status: '已办结' },
    { id: 'SB-2026-110', name: '周鹏', type: '参保地变更', unit: '维达石化', date: '2026-10-08', status: '已办结' },
    { id: 'SB-2026-109', name: '黄磊', type: '退休减员', unit: '集团本部', date: '2026-09-30', status: '已办结' },
    { id: 'SB-2026-108', name: '吴磊', type: '新增参保', unit: '兰达工贸', date: '2026-09-15', status: '已申报' },
    { id: 'SB-2026-107', name: '孙慧', type: '基数调整', unit: '宏达人力', date: '2026-09-01', status: '已办结' },
    { id: 'SB-2026-106', name: '陈立', type: '新增参保', unit: '三叶实业', date: '2026-08-20', status: '已办结' },
    { id: 'SB-2026-105', name: '刘婷', type: '基数调整', unit: '翔鑫工贸', date: '2026-08-01', status: '已办结' }
  ];

  const INS_BASE = E.map((x, i) => ({
    empNo: x.no, name: x.name, unit: x.unit,
    base: [10200, 8400, 11500, 6800, 6100, 7600, 5400, 5900, 5700, 7500, 4800, 12800, 5900, 8400][i],
    old: [9900, 8100, 11100, 6600, 5900, 7400, 5200, 5700, 5500, 7300, 4600, 12400, 5700, 8100][i],
    diff: [300, 300, 400, 200, 200, 200, 200, 200, 200, 200, 200, 400, 200, 300][i],
    status: i % 6 === 0 ? '待核定' : '已申报'
  }));

  const PAY_UNITS = [
    { unit: '集团本部', people: 386, base: '262.5 万', unitPart: '98.1 万', personPart: '57.6 万', total: '155.7 万' },
    { unit: '三叶实业', people: 726, base: '493.7 万', unitPart: '186.2 万', personPart: '108.4 万', total: '294.6 万' },
    { unit: '汇丰石化', people: 618, base: '420.2 万', unitPart: '158.1 万', personPart: '92.3 万', total: '250.4 万' },
    { unit: '翔鑫工贸', people: 452, base: '307.4 万', unitPart: '115.9 万', personPart: '67.5 万', total: '183.4 万' },
    { unit: '维达石化', people: 268, base: '182.2 万', unitPart: '68.7 万', personPart: '40.1 万', total: '108.8 万' },
    { unit: '宏达人力', people: 246, base: '167.3 万', unitPart: '63.1 万', personPart: '36.8 万', total: '99.9 万' },
    { unit: '兰达工贸', people: 150, base: '102.0 万', unitPart: '38.5 万', personPart: '22.4 万', total: '60.9 万' }
  ];

  const CLAIMS = [
    { id: 'DY-2026-031', name: '黄磊', type: '退休待遇申报', unit: '集团本部', date: '2026-10-20', progress: '已批 3 件', status: '已核定' },
    { id: 'DY-2026-030', name: '马超', type: '工伤认定待遇', unit: '三叶实业', date: '2026-10-18', progress: '办理中', status: '办理中' },
    { id: 'DY-2026-029', name: '孙慧', type: '生育津贴申领', unit: '宏达人力', date: '2026-10-12', progress: '已发放', status: '已发放' },
    { id: 'DY-2026-028', name: '何欣', type: '失业金申领', unit: '翔鑫工贸', date: '2026-10-09', progress: '审核中', status: '审核中' },
    { id: 'DY-2026-027', name: '张伟', type: '工伤认定待遇', unit: '集团本部', date: '2026-09-28', progress: '已批', status: '已办结' },
    { id: 'DY-2026-026', name: '刘婷', type: '生育津贴申领', unit: '翔鑫工贸', date: '2026-09-15', progress: '已发放', status: '已发放' },
    { id: 'DY-2026-025', name: '徐涛', type: '退休待遇申报', unit: '维达石化', date: '2026-09-01', progress: '已批', status: '已办结' },
    { id: 'DY-2026-024', name: '吴磊', type: '失业金申领', unit: '兰达工贸', date: '2026-08-18', progress: '已发放', status: '已发放' }
  ];

  /* ---------- 绩效 ---------- */
  const KPI_LIB = [
    { code: 'HSE-01', name: '安全事故率（一票否决）', type: 'KPI', weight: '15%', source: '安全环保系统', veto: '是' },
    { code: 'ENV-03', name: '单位产品综合能耗', type: 'KPI', weight: '10%', source: '能源计量系统', veto: '否' },
    { code: 'PRD-05', name: '装置平稳率 / 非计划停工', type: 'KPI', weight: '12%', source: 'DCS / MES', veto: '否' },
    { code: 'OKR-02', name: '年度重点任务达成率', type: 'OKR', weight: '20%', source: '系统填报', veto: '否' },
    { code: 'CMP-01', name: '协作满意度评价', type: '360', weight: '5%', source: '问卷测评', veto: '否' },
    { code: 'SKL-04', name: '技能等级 / 职称晋升', type: 'KPI', weight: '8%', source: '职称技能库', veto: '否' },
    { code: 'SAF-02', name: '隐患整改及时率', type: 'KPI', weight: '10%', source: '隐患排查系统', veto: '否' },
    { code: 'ENV-05', name: '环保排放达标率', type: 'KPI', weight: '10%', source: '在线监测', veto: '是' }
  ];

  const PERF_TEMPLATES = [
    { series: '管理序列', kpi: 50, okr: 30, eval360: 20, special: '安全环保占 15%', count: 186 },
    { series: '技术序列', kpi: 55, okr: 25, eval360: 20, special: '能耗与平稳率占 20%', count: 312 },
    { series: '技能序列', kpi: 60, okr: 25, eval360: 15, special: '安全操作占 20%', count: 1864 },
    { series: '班组序列', kpi: 45, okr: 35, eval360: 20, special: '安全积分占 15%', count: 484 }
  ];

  const PERF_PROCESS = E.map((x, i) => ({
    id: 'KH-2026-' + String(101 + i), empNo: x.no, name: x.name, unit: x.unit, dept: x.dept,
    self: 80 + (i % 5) * 3, leader: 78 + (i % 6) * 3, calib: 0, level: ['A', 'B', 'B', 'C'][i % 4],
    stage: ['自评完成', '上级评议', '结果校准', '面谈确认'][i % 4], status: i % 4 === 3 ? '已确认' : '进行中'
  }));

  const PERF_RESULT = {
    dist: [
      { level: 'A 优秀', count: 512, pct: 18, color: '#7055df' },
      { level: 'B 良好', count: 1480, pct: 52, color: '#4389ed' },
      { level: 'C 合格', count: 740, pct: 26, color: '#14a58b' },
      { level: 'D 不合格', count: 114, pct: 4, color: '#eb6262' }
    ],
    links: [
      { title: '薪酬挂钩', desc: '绩效工资 = 基本薪酬 × 20% × 系数；A 1.3 / B 1.1 / C 1.0 / D 0.7；年度效益奖 A 级上浮 30%' },
      { title: '晋升任用', desc: '连续 2 年 A 级方可进入晋升候选；D 级当年不得晋升、不得竞聘；干部任免须附 3 年绩效记录' },
      { title: '评优评先', desc: '优秀、劳模、先进从 A 级中产生；评优比例不超过 15%；C / D 级不得参评当年度先进' },
      { title: '培训发展', desc: 'C 级进入能力提升计划；D 级强制培训并跟踪考核；A 级优先纳入人才梯队与导师带徒' },
      { title: '末等调整', desc: '连续 2 年 D 级启动岗位调整；可降级、转岗或待岗培训；纳入末等调整台账并跟踪' }
    ]
  };

  /* ---------- 职称 / 技能 ---------- */
  const TITLE_RECORDS = [
    { id: 'ZC-2026-021', name: '张伟', title: '高级工程师', level: '副高级', unit: '集团本部', date: '2026-10-20', status: '评审中', allowance: '800 元/月' },
    { id: 'ZC-2026-020', name: '王强', title: '正高级工程师', level: '正高级', unit: '汇丰石化', date: '2026-09-28', status: '已聘任', allowance: '1,200 元/月' },
    { id: 'ZC-2026-019', name: '郑霞', title: '高级工程师', level: '副高级', unit: '汇丰石化', date: '2026-09-15', status: '已聘任', allowance: '800 元/月' },
    { id: 'ZC-2026-018', name: '李静', title: '高级人力资源管理师', level: '副高级', unit: '集团本部', date: '2026-08-30', status: '已聘任', allowance: '800 元/月' },
    { id: 'ZC-2026-017', name: '陈立', title: '工程师', level: '中级', unit: '三叶实业', date: '2026-08-10', status: '已聘任', allowance: '500 元/月' },
    { id: 'ZC-2026-016', name: '赵敏', title: '高级会计师', level: '副高级', unit: '集团本部', date: '2026-07-25', status: '评审中', allowance: '800 元/月' },
    { id: 'ZC-2026-015', name: '刘婷', title: '工程师', level: '中级', unit: '翔鑫工贸', date: '2026-07-01', status: '已聘任', allowance: '500 元/月' },
    { id: 'ZC-2026-014', name: '周鹏', title: '助理工程师', level: '初级', unit: '维达石化', date: '2026-06-15', status: '已聘任', allowance: '300 元/月' },
    { id: 'ZC-2026-013', name: '黄磊', title: '正高级工程师', level: '正高级', unit: '集团本部', date: '2026-06-01', status: '已聘任', allowance: '1,200 元/月' },
    { id: 'ZC-2026-012', name: '徐涛', title: '工程师', level: '中级', unit: '维达石化', date: '2026-05-18', status: '已聘任', allowance: '500 元/月' }
  ];

  const SKILL_RECORDS = E.slice(0, 12).map((x, i) => ({
    id: 'JN-2026-' + String(101 + i), empNo: x.no, name: x.name, unit: x.unit, post: x.position,
    level: ['高级技师', '技师', '高级工', '中级工'][i % 4], cert: '职业技能等级证书',
    date: '2026-0' + (6 + (i % 4)) + '-15', status: i % 5 === 0 ? '鉴定中' : '已聘任', allowance: ['1,000', '700', '500', '300'][i % 4] + ' 元/月'
  }));

  const REGISTER_RECORDS = [
    { id: 'ZG-01', name: '张伟', cert: '注册安全工程师', no: '2018620100005678', unit: '集团本部', valid: '2029-06-30', status: '有效' },
    { id: 'ZG-02', name: '郑霞', cert: '注册安全工程师', no: '2020620100001234', unit: '汇丰石化', valid: '2027-08-01', status: '有效' },
    { id: 'ZG-03', name: '王强', cert: '注册设备监理师', no: '2012000123', unit: '汇丰石化', valid: '长期有效', status: '有效' },
    { id: 'ZG-04', name: '赵敏', cert: '中级会计专业技术资格', no: '2018000567', unit: '集团本部', valid: '长期有效', status: '有效' },
    { id: 'ZG-05', name: '黄磊', cert: '化工总控工（高级技师）', no: '2015000123', unit: '集团本部', valid: '2028-01-01', status: '有效' },
    { id: 'ZG-06', name: '刘婷', cert: '化学检验员（高级工）', no: '2019000456', unit: '翔鑫工贸', valid: '长期有效', status: '有效' },
    { id: 'ZG-07', name: '李静', cert: '企业人力资源管理师（二级）', no: '2016000234', unit: '集团本部', valid: '长期有效', status: '有效' },
    { id: 'ZG-08', name: '孙慧', cert: '劳动关系协调员（二级）', no: '2017000789', unit: '宏达人力', valid: '长期有效', status: '有效' }
  ];

  /* ---------- 培训 ---------- */
  const TRAINING_PLANS = [
    { id: 'PX-2026-042', name: '11 月第 1 周 · 班组安全学习', item: '班组安全活动日、事故案例复盘', dept: '安全环保部', people: 326, period: '11-02 ~ 11-06', budget: '1.2 万', status: '执行中' },
    { id: 'PX-2026-041', name: '11 月特种作业复审培训', item: '电工、焊工复审取证培训', dept: '人力资源部', people: 218, period: '11-10 ~ 11-14', budget: '8.6 万', status: '待启动' },
    { id: 'PX-2026-040', name: '四季度化工总控工技能提升', item: '总控工仿真操作与工艺优化', dept: '生产运行部', people: 186, period: '10-15 ~ 12-20', budget: '24.0 万', status: '执行中' },
    { id: 'PX-2026-039', name: '2026 年度新员工入职培训', item: '企业文化、安全三级教育、岗位见习', dept: '人力资源部', people: 156, period: '07-01 ~ 12-31', budget: '36.0 万', status: '执行中' },
    { id: 'PX-2026-038', name: '年度管理干部研修班', item: '战略管理、绩效面谈、合规经营', dept: '集团人资部', people: 86, period: '11-20 ~ 11-22', budget: '48.0 万', status: '待审批' },
    { id: 'PX-2026-037', name: '12 月第 2 周 · 冬季安全生产', item: '防冻防凝、冬季事故预案演练', dept: '安全环保部', people: 428, period: '12-08 ~ 12-12', budget: '2.4 万', status: '待启动' }
  ];

  const TRAINING_CLASSES = [
    { id: 'CL-2026-112', name: '三级安全教育 · 厂级班（第 12 期）', item: '厂级安全教育与考核', dept: '安全环保部', people: 156, period: '10-20 ~ 10-22', sign: '98%', score: 92.4, status: '已结班' },
    { id: 'CL-2026-111', name: '化工总控工仿真操作班（中级）', item: 'DCS 仿真操作训练', dept: '生产运行部', people: 68, period: '10-22 ~ 10-26', sign: '95%', score: 88.6, status: '进行中' },
    { id: 'CL-2026-110', name: '特种作业电工复审班', item: '电工复审取证', dept: '人力资源部', people: 48, period: '10-27 ~ 10-29', sign: '100%', score: 90.1, status: '进行中' },
    { id: 'CL-2026-109', name: '班组长管理能力提升班', item: '现场管理、绩效面谈', dept: '集团人资部', people: 36, period: '11-03 ~ 11-05', sign: '—', score: '—', status: '待开班' },
    { id: 'CL-2026-108', name: '新员工入职引导班（第 8 期）', item: '企业文化与规章制度', dept: '人力资源部', people: 42, period: '10-28 ~ 10-30', sign: '96%', score: 91.2, status: '已结班' }
  ];

  const SAFETY_EDU = [
    { unit: '集团本部', total: 386, plant: 100, dept: 100, team: 99, status: '达标' },
    { unit: '三叶实业', total: 726, plant: 100, dept: 98, team: 96, status: '达标' },
    { unit: '汇丰石化', total: 618, plant: 100, dept: 100, team: 98, status: '达标' },
    { unit: '翔鑫工贸', total: 452, plant: 100, dept: 97, team: 95, status: '达标' },
    { unit: '维达石化', total: 268, plant: 100, dept: 96, team: 94, status: '达标' },
    { unit: '宏达人力', total: 246, plant: 100, dept: 95, team: 92, status: '待补训' },
    { unit: '兰达工贸', total: 150, plant: 100, dept: 94, team: 90, status: '待补训' }
  ];

  const SPECIAL_TRAINING = [
    { id: 'TSP-01', name: '周鹏', post: '电气维修工', cert: '低压电工作业证', valid: '2026-11-20', status: '待复审', plan: '11 月电工复审班' },
    { id: 'TSP-02', name: '马超', post: '焊工', cert: '熔化焊接与热切割作业证', valid: '2029-05-30', status: '有效', plan: '—' },
    { id: 'TSP-03', name: '吴磊', post: '化工操作工', cert: '危险化学品安全作业证', valid: '2026-12-15', status: '待复审', plan: '12 月危化品复审班' },
    { id: 'TSP-04', name: '陈立', post: '值班长', cert: '高处作业证', valid: '2030-03-10', status: '有效', plan: '—' },
    { id: 'TSP-05', name: '王强', post: '设备工程师', cert: '压力容器作业证', valid: '2026-10-31', status: '逾期', plan: '立即停岗复审' },
    { id: 'TSP-06', name: '郑霞', post: '安全员', cert: '危险化学品安全作业证', valid: '2029-04-11', status: '有效', plan: '—' },
    { id: 'TSP-07', name: '徐涛', post: '值班长', cert: '危险化学品安全作业证', valid: '2029-06-01', status: '有效', plan: '—' },
    { id: 'TSP-08', name: '张伟', post: '调度员', cert: '注册安全工程师', valid: '2029-06-30', status: '有效', plan: '—' }
  ];

  const MENTOR = [
    { id: 'DS-01', master: '张伟', apprentice: '马超', post: '焊工', start: '2026-07-01', cycle: '6 个月', progress: 45, status: '带徒中' },
    { id: 'DS-02', master: '王强', apprentice: '周鹏', post: '电气维修工', start: '2025-09-01', cycle: '12 个月', progress: 88, status: '带徒中' },
    { id: 'DS-03', master: '陈立', apprentice: '吴磊', post: '化工操作工', start: '2025-03-01', cycle: '12 个月', progress: 96, status: '待考核' },
    { id: 'DS-04', master: '郑霞', apprentice: '刘婷', post: '化验员', start: '2026-01-10', cycle: '6 个月', progress: 72, status: '带徒中' },
    { id: 'DS-05', master: '黄磊', apprentice: '徐涛', post: '工艺工程师', start: '2024-06-01', cycle: '24 个月', progress: 100, status: '已出师' },
    { id: 'DS-06', master: '李静', apprentice: '孙慧', post: '人事专员', start: '2025-06-01', cycle: '12 个月', progress: 90, status: '带徒中' },
    { id: 'DS-07', master: '赵敏', apprentice: '何欣', post: '会计', start: '2024-09-01', cycle: '12 个月', progress: 100, status: '已出师' },
    { id: 'DS-08', master: '徐涛', apprentice: '张一帆', post: '化工总控工', start: '2026-10-28', cycle: '12 个月', progress: 5, status: '带徒中' }
  ];

  const TALENT = [
    { id: 'RC-01', name: '张伟', unit: '集团本部', post: '生产调度主管', level: '后备干部', readiness: '1 年内可上任', status: '重点培养' },
    { id: 'RC-02', name: '王强', unit: '汇丰石化', post: '设备管理部副部长', level: '关键岗位继任', readiness: '即插即用', status: '已储备' },
    { id: 'RC-03', name: '李静', unit: '集团本部', post: '人力资源部部长助理', level: '后备干部', readiness: '2 年内可上任', status: '培养中' },
    { id: 'RC-04', name: '陈立', unit: '三叶实业', post: '生产运行部部长', level: '关键岗位继任', readiness: '1 年内可上任', status: '培养中' },
    { id: 'RC-05', name: '郑霞', unit: '汇丰石化', post: '安全环保部部长', level: '后备干部', readiness: '2 年内可上任', status: '培养中' },
    { id: 'RC-06', name: '赵敏', unit: '集团本部', post: '财务共享中心主任', level: '关键岗位继任', readiness: '1 年内可上任', status: '已储备' },
    { id: 'RC-07', name: '周鹏', unit: '维达石化', post: '设备管理部部长', level: '梯队人才', readiness: '3 年内可上任', status: '观察中' },
    { id: 'RC-08', name: '徐涛', unit: '维达石化', post: '生产运行部副部长', level: '后备干部', readiness: '1 年内可上任', status: '重点培养' }
  ];

  const COURSES = [
    { id: 'CO-01', name: '三级安全教育（厂级）', teacher: '郑霞', hours: 2.5, learners: 1286, progress: 78, status: '进行中' },
    { id: 'CO-02', name: '化工总控工技能提升', teacher: '黄磊', hours: 6, learners: 486, progress: 45, status: '进行中' },
    { id: 'CO-03', name: '危化品安全管理条例', teacher: '郑霞', hours: 1.5, learners: 942, progress: 100, status: '已完成' },
    { id: 'CO-04', name: '新员工入职引导', teacher: '李静', hours: 2, learners: 156, progress: 0, status: '未开始' },
    { id: 'CO-05', name: '班组长现场管理实务', teacher: '张伟', hours: 4, learners: 86, progress: 62, status: '进行中' },
    { id: 'CO-06', name: 'DCS 仿真操作进阶', teacher: '陈立', hours: 8, learners: 68, progress: 38, status: '进行中' }
  ];

  const LEARN_STATS = [
    { name: '张伟', unit: '生产运行部 · 调度主管', courses: 12, hours: 18.5, rate: 92 },
    { name: '吴磊', unit: '化工一厂 · 运行三班操作工', courses: 9, hours: 14.2, rate: 78 },
    { name: '周雨萱', unit: '人力资源部 · 招聘专员', courses: 15, hours: 22.8, rate: 100 },
    { name: '赵天成', unit: '维达石化 · 检维修技师', courses: 7, hours: 9.6, rate: 61 }
  ];

  /* ---------- 干部 / 盘点 ---------- */
  const CADRE_APPT = [
    { id: 'GB-2026-018', name: '张伟', from: '生产调度主管', to: '生产运行部副部长', type: '提拔', date: '2026-10-28', status: '任前公示' },
    { id: 'GB-2026-017', name: '王强', from: '设备工程师', to: '设备管理部部长', type: '提拔', date: '2026-10-20', status: '已任命' },
    { id: 'GB-2026-016', name: '李静', from: '人事专员', to: '人力资源部部长助理', type: '提拔', date: '2026-10-15', status: '已任命' },
    { id: 'GB-2026-015', name: '陈立', from: '值班长', to: '生产运行部部长', type: '提拔', date: '2026-09-30', status: '已任命' },
    { id: 'GB-2026-014', name: '郑霞', from: '安全员', to: '安全环保部副部长', type: '提拔', date: '2026-09-18', status: '已任命' },
    { id: 'GB-2026-013', name: '孙慧', from: '人事专员', to: '人力资源部主管', type: '提拔', date: '2026-09-01', status: '已任命' },
    { id: 'GB-2026-012', name: '周鹏', from: '电气维修班长', to: '设备管理部主管', type: '提拔', date: '2026-08-15', status: '已任命' },
    { id: 'GB-2026-011', name: '黄磊', from: '工艺工程师', to: '技术中心副主任', type: '平调', date: '2026-08-01', status: '已任命' }
  ];

  const CADRE_TERM = [
    { id: 'RQ-01', name: '王强', post: '设备管理部部长', term: '2026-2029', start: '2026-10-20', end: '2029-10-19', status: '首任', review: '待首次考核' },
    { id: 'RQ-02', name: '陈立', post: '生产运行部部长', term: '2026-2029', start: '2026-09-30', end: '2029-09-29', status: '首任', review: '待首次考核' },
    { id: 'RQ-03', name: '黄磊', post: '技术中心副主任', term: '2024-2027', start: '2026-08-01', end: '2027-07-31', status: '续任', review: '2026 年度考核 A' },
    { id: 'RQ-04', name: '张伟', post: '生产运行部副部长', term: '2026-2029', start: '2026-11-01', end: '2029-10-31', status: '首任', review: '待生效' },
    { id: 'RQ-05', name: '郑霞', post: '安全环保部副部长', term: '2025-2028', start: '2025-09-18', end: '2028-09-17', status: '交流轮岗', review: '2026 年度考核 B' },
    { id: 'RQ-06', name: '李静', post: '人力资源部部长助理', term: '2026-2029', start: '2026-10-15', end: '2029-10-14', status: '首任', review: '待首次考核' },
    { id: 'RQ-07', name: '周鹏', post: '设备管理部主管', term: '2026-2029', start: '2026-08-15', end: '2029-08-14', status: '首任', review: '待首次考核' },
    { id: 'RQ-08', name: '孙慧', post: '人力资源部主管', term: '2026-2029', start: '2026-09-01', end: '2029-08-31', status: '首任', review: '待首次考核' }
  ];

  const GRID9 = [
    { row: '高潜力', col: '低绩效', label: '待观察', cls: 'warn', names: ['周鹏', '吴磊'] },
    { row: '高潜力', col: '中绩效', label: '潜力股', cls: '', names: ['李静', '孙慧', '刘婷'] },
    { row: '高潜力', col: '高绩效', label: '明星人才', cls: 'high', names: ['张伟', '王强'] },
    { row: '中潜力', col: '低绩效', label: '需改进', cls: 'warn', names: ['马超'] },
    { row: '中潜力', col: '中绩效', label: '中坚力量', cls: '', names: ['陈立', '赵敏', '郑霞'] },
    { row: '中潜力', col: '高绩效', label: '骨干', cls: '', names: ['徐涛', '黄磊'] },
    { row: '低潜力', col: '低绩效', label: '待调整', cls: 'warn', names: ['何欣'] },
    { row: '低潜力', col: '中绩效', label: '稳定贡献', cls: '', names: ['吴磊'] },
    { row: '低潜力', col: '高绩效', label: '专家型', cls: '', names: ['刘婷'] }
  ];

  const SUCCESSION = [
    { id: 'JJ-01', post: '生产运行部部长', unit: '集团本部', incumbent: '李强', successors: '陈立、张伟', readiness: '1 年内', status: '已储备' },
    { id: 'JJ-02', post: '设备管理部部长', unit: '汇丰石化', incumbent: '王强', successors: '周鹏', readiness: '1 年内', status: '已储备' },
    { id: 'JJ-03', post: '安全环保部部长', unit: '汇丰石化', incumbent: '郑霞', successors: '刘婷', readiness: '2 年内', status: '培养中' },
    { id: 'JJ-04', post: '人力资源部部长', unit: '集团本部', incumbent: '王芳', successors: '李静、孙慧', readiness: '1 年内', status: '已储备' },
    { id: 'JJ-05', post: '财务共享中心主任', unit: '集团本部', incumbent: '王军', successors: '赵敏', readiness: '1 年内', status: '已储备' },
    { id: 'JJ-06', post: '技术中心主任', unit: '集团本部', incumbent: '黄磊', successors: '徐涛', readiness: '2 年内', status: '培养中' },
    { id: 'JJ-07', post: '生产运行部部长', unit: '三叶实业', incumbent: '陈立', successors: '吴磊', readiness: '2 年内', status: '培养中' },
    { id: 'JJ-08', post: '工程事业部部长', unit: '维达石化', incumbent: '赵天成', successors: '马超', readiness: '3 年内', status: '观察中' }
  ];

  const PARTY = [
    { id: 'DY-01', name: '张伟', unit: '集团本部', branch: '生产运行党支部', join: '2008-07', role: '支部书记', status: '在册', fee: '45 元/月' },
    { id: 'DY-02', name: '李静', unit: '集团本部', branch: '机关第一党支部', join: '2011-06', role: '组织委员', status: '在册', fee: '38 元/月' },
    { id: 'DY-03', name: '王强', unit: '汇丰石化', branch: '设备党支部', join: '2005-09', role: '党员', status: '在册', fee: '52 元/月' },
    { id: 'DY-04', name: '郑霞', unit: '汇丰石化', branch: '安全环保党支部', join: '2013-07', role: '宣传委员', status: '在册', fee: '40 元/月' },
    { id: 'DY-05', name: '陈立', unit: '三叶实业', branch: '化工一厂党支部', join: '2015-06', role: '党员', status: '在册', fee: '36 元/月' },
    { id: 'DY-06', name: '徐涛', unit: '维达石化', branch: '生产党支部', join: '2009-12', role: '党员', status: '在册', fee: '42 元/月' },
    { id: 'DY-07', name: '刘婷', unit: '翔鑫工贸', branch: '质量党支部', join: '2021-05', role: '共青团员', status: '发展对象', fee: '—' },
    { id: 'DY-08', name: '马超', unit: '三叶实业', branch: '设备党支部', join: '2024-09', role: '共青团员', status: '入党积极分子', fee: '—' }
  ];

  /* ---------- 职业健康 / 劳保 / 安全积分 ---------- */
  const HEALTH_EXAMS = E.map((x, i) => ({
    empNo: x.no, name: x.name, unit: x.unit, dept: x.dept,
    type: i % 3 === 0 ? '岗前体检' : i % 3 === 1 ? '岗中体检' : '离岗体检',
    date: '2026-0' + (6 + (i % 4)) + '-1' + (i % 9),
    result: i % 5 === 0 ? '复查' : '合格',
    next: '2027-0' + (6 + (i % 4)) + '-15'
  }));

  const OCC_DISEASE = [
    { id: 'BZ-2026-004', name: '徐涛', type: '噪声聋（轻度）', stage: '观察期', unit: '维达石化', date: '2026-08-20', status: '康复跟踪' },
    { id: 'BZ-2026-003', name: '张伟', type: '职业性哮喘', stage: '已鉴定', unit: '集团本部', date: '2026-05-15', status: '待遇办理' },
    { id: 'BZ-2026-002', name: '吴磊', type: '化学灼伤', stage: '已康复', unit: '兰达工贸', date: '2025-11-10', status: '已结案' },
    { id: 'BZ-2026-001', name: '周鹏', type: '听力下降（职业相关）', stage: '复查', unit: '维达石化', date: '2026-10-12', status: '跟踪中' }
  ];

  const LABOR_GOODS = [
    { id: 'LB-01', name: '张伟', unit: '集团本部', item: '安全帽 + 防护鞋', standard: '1 套/年', date: '2026-03-01', next: '2027-03-01', status: '正常' },
    { id: 'LB-02', name: '王强', unit: '汇丰石化', item: '防酸碱服 + 护目镜', standard: '1 套/2 年', date: '2025-06-15', next: '2027-06-15', status: '正常' },
    { id: 'LB-03', name: '周鹏', unit: '维达石化', item: '绝缘手套 + 绝缘鞋', standard: '1 套/年', date: '2026-01-10', next: '2027-01-10', status: '正常' },
    { id: 'LB-04', name: '马超', unit: '三叶实业', item: '焊接面罩 + 阻燃服', standard: '1 套/年', date: '2026-07-01', next: '2027-07-01', status: '正常' },
    { id: 'LB-05', name: '吴磊', unit: '兰达工贸', item: '防毒面具 + 防护服', standard: '1 套/年', date: '2025-11-01', next: '2026-11-01', status: '待更换' },
    { id: 'LB-06', name: '郑霞', unit: '汇丰石化', item: '正压式呼吸器', standard: '1 台/3 年', date: '2024-08-20', next: '2027-08-20', status: '正常' },
    { id: 'LB-07', name: '陈立', unit: '三叶实业', item: '安全绳 + 安全带', standard: '1 套/2 年', date: '2025-03-10', next: '2027-03-10', status: '正常' },
    { id: 'LB-08', name: '徐涛', unit: '维达石化', item: '防噪声耳罩', standard: '1 副/年', date: '2026-06-01', next: '2027-06-01', status: '正常' }
  ];

  const SAFETY_SCORE = [
    { id: 'AQ-2026-031', name: '吴磊', unit: '兰达工贸', event: '未按规定佩戴防护面罩', points: -5, date: '2026-10-25', status: '已确认', action: '安全再培训' },
    { id: 'AQ-2026-030', name: '周鹏', unit: '维达石化', event: '作业票未随身携带', points: -3, date: '2026-10-22', status: '已确认', action: '警告' },
    { id: 'AQ-2026-029', name: '张伟', unit: '集团本部', event: '发现并制止违章作业', points: 10, date: '2026-10-20', status: '已确认', action: '通报表扬' },
    { id: 'AQ-2026-028', name: '马超', unit: '三叶实业', event: '动火作业监护不到位', points: -8, date: '2026-10-18', status: '已确认', action: '停岗培训' },
    { id: 'AQ-2026-027', name: '郑霞', unit: '汇丰石化', event: '组织隐患整改及时', points: 8, date: '2026-10-15', status: '已确认', action: '安全奖' },
    { id: 'AQ-2026-026', name: '王强', unit: '汇丰石化', event: '设备检修未挂牌上锁', points: -6, date: '2026-10-12', status: '已确认', action: '警告' },
    { id: 'AQ-2026-025', name: '陈立', unit: '三叶实业', event: '班组安全活动组织优秀', points: 6, date: '2026-10-08', status: '已确认', action: '班组表彰' },
    { id: 'AQ-2026-024', name: '徐涛', unit: '维达石化', event: '未及时上报设备异常', points: -2, date: '2026-10-05', status: '已确认', action: '提醒谈话' }
  ];

  /* ---------- 员工关系 ---------- */
  const REWARDS = [
    { id: 'JL-2026-031', name: '张伟', type: '表彰', content: '2026 年度安全生产先进个人', date: '2026-10-20', status: '已归档' },
    { id: 'JL-2026-030', name: '郑霞', type: '记功', content: '隐患排查治理突出贡献', date: '2026-10-12', status: '已归档' },
    { id: 'JL-2026-029', name: '吴磊', type: '处分', content: '违反安全操作规程，警告处分', date: '2026-10-08', status: '执行中' },
    { id: 'JL-2026-028', name: '王强', type: '表彰', content: '设备管理标杆个人', date: '2026-09-28', status: '已归档' },
    { id: 'JL-2026-027', name: '马超', type: '处分', content: '实习期间擅自操作设备，通报批评', date: '2026-09-15', status: '执行中' },
    { id: 'JL-2026-026', name: '陈立', type: '表彰', content: '班组建设先进个人', date: '2026-09-01', status: '已归档' },
    { id: 'JL-2026-025', name: '周鹏', type: '处分', content: '未按规定交接班，警告处分', date: '2026-08-20', status: '已解除' },
    { id: 'JL-2026-024', name: '李静', type: '记功', content: '招聘专项工作突出表现', date: '2026-08-10', status: '已归档' }
  ];

  const HONORS = [
    { id: 'PY-01', name: '张伟', honor: '劳动模范', level: '集团级', date: '2026-10-20', status: '公示中' },
    { id: 'PY-02', name: '郑霞', honor: '先进个人', level: '集团级', date: '2026-10-20', status: '公示中' },
    { id: 'PY-03', name: '陈立', honor: '先进个人', level: '子公司级', date: '2026-09-15', status: '已表彰' },
    { id: 'PY-04', name: '王强', honor: '先进工作者', level: '子公司级', date: '2026-09-10', status: '已表彰' },
    { id: 'PY-05', name: '生产运行部', honor: '先进集体', level: '集团级', date: '2026-08-30', status: '已表彰' },
    { id: 'PY-06', name: '李静', honor: '优秀共产党员', level: '集团级', date: '2026-07-01', status: '已表彰' }
  ];

  const APPEALS = [
    { id: 'SS-2026-008', name: '周鹏', type: '薪酬申诉', content: '加班费计算基数有误', date: '2026-10-20', status: '处理中', owner: '李静' },
    { id: 'SS-2026-007', name: '吴磊', type: '考核申诉', content: '三季度考核等级异议', date: '2026-10-18', status: '已办结', owner: '陈立' },
    { id: 'SS-2026-006', name: '马超', type: '工作环境', content: '焊接作业防护用品不足', date: '2026-10-10', status: '已办结', owner: '郑霞' },
    { id: 'SS-2026-005', name: '刘婷', type: '岗位调整', content: '岗位调整未征求意见', date: '2026-09-28', status: '已办结', owner: '李静' },
    { id: 'SS-2026-004', name: '孙慧', type: '用工性质', content: '派遣转正申请进度咨询', date: '2026-09-15', status: '已办结', owner: '王芳' }
  ];

  const CARE = [
    { id: 'GF-01', name: '孙慧', type: '生育慰问', date: '2026-10-10', detail: '产后慰问金 1,000 元 + 慰问品', status: '已完成' },
    { id: 'GF-02', name: '马超', type: '住院慰问', date: '2026-09-25', detail: '工伤住院慰问 800 元', status: '已完成' },
    { id: 'GF-03', name: '何欣', type: '困难帮扶', date: '2026-09-10', detail: '困难职工帮扶金 2,000 元', status: '已发放' },
    { id: 'GF-04', name: '李静', type: '生日慰问', date: '2026-11-05', detail: '生日礼券 200 元', status: '待发放' },
    { id: 'GF-05', name: '王强', type: '节日慰问', date: '2026-10-01', detail: '国庆节日慰问品', status: '已完成' },
    { id: 'GF-06', name: '刘婷', type: '婚育慰问', date: '2026-10-18', detail: '婚假慰问金 800 元', status: '已完成' },
    { id: 'GF-07', name: '徐涛', type: '困难帮扶', date: '2026-08-20', detail: '子女助学帮扶 1,500 元', status: '已发放' },
    { id: 'GF-08', name: '张伟', type: '住院慰问', date: '2026-07-15', detail: '住院慰问 800 元', status: '已完成' }
  ];

  const RETIREES = [
    { id: 'LT-01', name: '黄磊', unit: '集团本部', retireDate: '2026-02-01', type: '返聘', activity: '技术顾问', status: '返聘中' },
    { id: 'LT-02', name: '刘建国', unit: '汇丰石化', retireDate: '2025-12-01', type: '正常退休', activity: '退休党支部活动', status: '已移交' },
    { id: 'LT-03', name: '王秀兰', unit: '三叶实业', retireDate: '2025-10-15', type: '正常退休', activity: '重阳节慰问', status: '已移交' },
    { id: 'LT-04', name: '赵永福', unit: '翔鑫工贸', retireDate: '2026-06-30', type: '特殊工种退休', activity: '体检服务', status: '已移交' },
    { id: 'LT-05', name: '孙志强', unit: '维达石化', retireDate: '2026-08-01', type: '正常退休', activity: '退休欢送会', status: '已移交' },
    { id: 'LT-06', name: '李梅', unit: '宏达人力', retireDate: '2026-09-30', type: '正常退休', activity: '节日慰问', status: '已移交' }
  ];

  /* ---------- 报表 / 系统 ---------- */
  const REPORT_UNITS = [
    { unit: '三叶实业', people: 726, pct: 25.5 },
    { unit: '汇丰石化', people: 618, pct: 21.7 },
    { unit: '翔鑫工贸', people: 452, pct: 15.9 },
    { unit: '集团本部', people: 386, pct: 13.6 },
    { unit: '维达石化', people: 268, pct: 9.4 },
    { unit: '宏达人力', people: 246, pct: 8.6 },
    { unit: '兰达工贸', people: 150, pct: 5.3 }
  ];

  const REPORT_KPIS = [
    { label: '在册员工', value: '2,846 人', note: '+2.1%' },
    { label: '年度人工成本', value: '1.84 亿', note: '+6.4%' },
    { label: '人均人工成本', value: '6.47 万', note: '+4.2%' },
    { label: '人工成本率', value: '12.8%', note: '-0.6pt' }
  ];

  const PERMISSIONS = [
    { role: '集团管理员', desc: '全集团所有模块与数据权限', scope: '全集团 / 全部字段', count: 6 },
    { role: '子公司人资', desc: '本单位人事业务与审批', scope: '本单位 / 敏感字段脱敏', count: 24 },
    { role: '薪酬专员', desc: '薪酬核算、发放与报表', scope: '本单位 / 薪酬字段可见', count: 18 },
    { role: '部门负责人', desc: '本部门员工、考勤、绩效审批', scope: '本部门 / 绩效字段', count: 86 },
    { role: '普通员工', desc: '个人信息、考勤、工资条查询', scope: '本人 / 只读', count: 2712 },
    { role: '审计员', desc: '操作日志与审计查询', scope: '全集团 / 只读', count: 4 }
  ];

  const WORKFLOWS = [
    { id: 'WF-01', name: '员工入职审批流', steps: '报到 → 部门确认 → 人资审核 → 建档', nodes: 4, status: '启用', updated: '2026-09-01' },
    { id: 'WF-02', name: '岗位调动审批流', steps: '申请 → 部门负责人 → 人资 → 分管领导', nodes: 4, status: '启用', updated: '2026-08-15' },
    { id: 'WF-03', name: '薪酬调整审批流', steps: '申请 → 部门 → 人资 → 财务 → 总经理', nodes: 5, status: '启用', updated: '2026-07-01' },
    { id: 'WF-04', name: '离职审批流', steps: '申请 → 部门 → 人资 → 财务 → 交接确认', nodes: 5, status: '启用', updated: '2026-06-20' },
    { id: 'WF-05', name: '培训计划审批流', steps: '编制 → 部门 → 人资 → 预算 → 分管领导', nodes: 5, status: '启用', updated: '2026-05-10' },
    { id: 'WF-06', name: '档案借阅审批流', steps: '申请 → 档案管理员 → 人资负责人', nodes: 3, status: '启用', updated: '2026-04-01' }
  ];

  const CONFIGS = [
    { id: 'CF-01', name: '机构编码规则', value: 'ZL-{单位2}-{部门2}-{科室2}-{班组2}', updated: '2026-01-01' },
    { id: 'CF-02', name: '员工工号规则', value: 'ZL + 5 位流水', updated: '2026-01-01' },
    { id: 'CF-03', name: '试用期默认', value: '6 个月（技能序列 3 个月）', updated: '2026-03-01' },
    { id: 'CF-04', name: '年休假规则', value: '工龄 1–10 年 5 天 / 10–20 年 10 天 / 20 年以上 15 天', updated: '2026-01-01' },
    { id: 'CF-05', name: '节假日日历', value: '2026 年国家法定节假日（11 天）', updated: '2026-01-10' },
    { id: 'CF-06', name: '薪酬标准版本', value: 'V2026.1（2026-01-01 生效）', updated: '2026-01-01' },
    { id: 'CF-07', name: '合同到期预警', value: '提前 90 / 30 / 7 天', updated: '2026-02-01' },
    { id: 'CF-08', name: '证照到期预警', value: '提前 90 / 30 / 7 天', updated: '2026-02-01' }
  ];

  const AUDIT = [
    { id: 'AU-2026-1021', user: '张伟', action: '修改员工档案', object: '张伟（ZL10001）', ip: '10.20.3.18', time: '2026-10-29 09:42', result: '成功' },
    { id: 'AU-2026-1020', user: '李静', action: '审批岗位调动', object: 'YD-2026-107', ip: '10.20.5.22', time: '2026-10-29 09:15', result: '成功' },
    { id: 'AU-2026-1019', user: '王强', action: '劳动合同续签', object: 'HT-2026-031', ip: '10.20.7.36', time: '2026-10-28 17:30', result: '成功' },
    { id: 'AU-2026-1018', user: '赵敏', action: '锁定考勤数据', object: '2026 年 10 月考勤', ip: '10.20.4.12', time: '2026-10-28 16:05', result: '成功' },
    { id: 'AU-2026-1017', user: '陈立', action: '薪酬标准调整', object: 'TJ-2026-037', ip: '10.20.6.28', time: '2026-10-28 14:20', result: '成功' },
    { id: 'AU-2026-1016', user: 'unknown', action: '登录尝试', object: 'admin', ip: '61.178.***.***', time: '2026-10-28 11:08', result: '失败' },
    { id: 'AU-2026-1015', user: '孙慧', action: '档案借阅登记', object: 'JY-2026-0062', ip: '10.20.8.41', time: '2026-10-27 15:40', result: '成功' },
    { id: 'AU-2026-1014', user: '李静', action: '导出员工名册', object: '员工基础信息（14 条）', ip: '10.20.5.22', time: '2026-10-27 10:12', result: '成功' }
  ];

  return {
    ORG_UNITS, ORG_TREE, ORG_CHANGES, ORG_CODES, POSITIONS, RANKS,
    TRANSFERS, DUTY_CHANGES, SENIORITY, SENIORITY_VERIFY, SPECIAL_WORK, SENIORITY_APPLY,
    CONTRACTS, CONTRACT_CHANGES, AGREEMENTS, DISPUTES,
    DEMANDS, CANDIDATES, EVALUATIONS, OFFERS, RECRUIT_TYPES, GRADUATE_DEFENSE,
    SHIFTS, SHIFT_MATRIX, DUTY_ROSTER, ATTENDANCE, ATT_EXCEPTIONS, LEAVE_BALANCE, LEAVE_RECORDS, OVERTIME,
    SAL_STANDARDS, SAL_STRUCTURE, PAYROLL, SAL_STEPS, SAL_RECORDS, SAL_ADJUST, BONUS, COST_STRUCT,
    INS_TYPES, INS_CHANGES, INS_BASE, PAY_UNITS, CLAIMS,
    KPI_LIB, PERF_TEMPLATES, PERF_PROCESS, PERF_RESULT,
    TITLE_RECORDS, SKILL_RECORDS, REGISTER_RECORDS,
    TRAINING_PLANS, TRAINING_CLASSES, SAFETY_EDU, SPECIAL_TRAINING, MENTOR, TALENT, COURSES, LEARN_STATS,
    CADRE_APPT, CADRE_TERM, GRID9, SUCCESSION, PARTY,
    HEALTH_EXAMS, OCC_DISEASE, LABOR_GOODS, SAFETY_SCORE,
    REWARDS, HONORS, APPEALS, CARE, RETIREES,
    REPORT_UNITS, REPORT_KPIS, PERMISSIONS, WORKFLOWS, CONFIGS, AUDIT
  };
})();
