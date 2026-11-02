/* 通用页面工厂：把功能清单中的每个二级功能转成可交互演示页面 */
window.HR_SPECS = {};

(function () {
  const D2 = window.HR_DATA2;
  const U = () => window.HR_UI;

  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (n) => `<svg class="ico"><use href="#i-${n}"/></svg>`;

  function statusTag(v) { return U().statusTag(v); }
  function chip(v, cls) { return U().softChip(v, cls); }
  function searchInput(key, ph) {
    const v = U().getFilter(key).q || '';
    return `<div class="input-icon-wrap">${svg('search')}<input class="input filter-input" data-fk="${key}" data-filter="q" placeholder="${esc(ph)}" value="${esc(v)}"></div>`;
  }
  function selectInput(key, field, options, allLabel) {
    const v = U().getFilter(key)[field] || '';
    return `<select class="select filter-select" data-fk="${key}" data-filter="${field}">
      <option value="">${esc(allLabel || '全部')}</option>
      ${options.map((o) => `<option value="${esc(o)}"${v === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}
    </select>`;
  }
  function exportBtn() {
    return `<button class="btn" data-act="export">${svg('download')}导出</button>`;
  }
  function mcards(list) {
    return `<div class="metrics-grid">${list.map((m) => `<div class="metric-card">
      <span class="metric-label">${esc(m.label)}</span>
      <div class="metric-value">${m.value}${m.unit ? `<small>${esc(m.unit)}</small>` : ''}</div>
      <div class="metric-note ${m.cls || ''}">${esc(m.note)}</div>
      <i style="color:${m.color || '#7659e7'}"></i></div>`).join('')}</div>`;
  }
  function panel(title, body, extra) {
    return `<section class="panel-card"><div class="panel-header"><h3>${esc(title)}</h3><span class="panel-extra">${extra || ''}</span></div>${body}</section>`;
  }

  function autoChipCls(v) {
    if (/待|中|审批|公示/.test(v)) return 'orange';
    if (/已完成|有效|已生效|已通过|已办结|已发放|达标|已聘任|已归档|已储备/.test(v)) return 'green';
    if (/逾期|不合格|失败|停岗/.test(v)) return 'red';
    return 'blue';
  }

  function cell(col, row) {
    const v = row[col.key];
    if (col.render) return col.render(row);
    if (col.status) return statusTag(v);
    if (col.chip) return chip(v, col.cls || autoChipCls(String(v || '')));
    if (col.chipFixed) return chip(v, col.chipFixed);
    if (col.pct) {
      return `<div class="progress-line"><div class="progress ${col.progressCls || ''}"><span style="width:${Number(v) || 0}%"></span></div><b>${Number(v) || 0}%</b></div>`;
    }
    if (col.money) return `<span class="num">${esc(v)}</span>`;
    if (col.bold) return `<span class="strong">${esc(v)}</span>`;
    if (col.sub) return `<span class="sub">${esc(v)}</span>`;
    return esc(v == null ? '—' : v);
  }

  function build(cfg) {
    const metaSrc = cfg.meta || {};
    const formFields = cfg.fields || metaSrc.fields || null;
    const tabs = cfg.tabs || [{
      key: 'main', label: cfg.tabLabel || '', title: cfg.panelTitle || cfg.title,
      columns: cfg.columns, rows: cfg.rows, filter: cfg.filter, searchKeys: cfg.searchKeys
    }];
    const page = {
      key: cfg.key,
      title: cfg.title,
      desc: cfg.desc,
      actions: cfg.actions || [
        formFields ? { label: '新增' + (metaSrc.entity || cfg.entity || '记录'), icon: 'plus', primary: true, act: 'g-add' } : null,
        { label: '导出', icon: 'download', act: 'export' }
      ].filter(Boolean),
      metrics: cfg.metrics || [],
      tabs: tabs.map((t) => ({ key: t.key, label: t.label || t.title })),
      columns: {},
      rows: {},
      panel: {},
      data: {},
      meta: {
        entity: metaSrc.entity || cfg.entity || '记录',
        fields: formFields,
        labels: metaSrc.labels || cfg.labels || {},
        detail: metaSrc.detail || null
      },
      extra: cfg.extra,
      custom: cfg.custom,
      width: cfg.width
    };

    const rowFns = {};
    tabs.forEach((t) => {
      if (t.rows) page.data[t.key] = t.rows;
      page.columns[t.key] = () => {
        const cols = t.columns.map((c) => ({ label: c.label, width: c.width || '', align: c.align, render: (row) => cell(c, row) }));
        if (formFields) {
          cols.push({
            label: '操作', width: '116px',
            render: (row) => {
              const id = row.id || row.empNo || row.name;
              let html = `<button class="link-btn" data-act="g-view" data-id="${esc(id)}">查看</button>`;
              if (!t.readonly) html += `<button class="link-btn muted" data-act="g-edit" data-id="${esc(id)}">编辑</button>`;
              if (t.rowAction) html += t.rowAction(row);
              return `<div class="actions">${html}</div>`;
            }
          });
        }
        return cols;
      };
      rowFns[t.key] = (tab, f) => {
        let rows = page.data[t.key] || [];
        f = f || {};
        if (f.q) {
          const keys = t.searchKeys || cfg.searchKeys || ['name', 'id', 'unit', 'dept', 'post', 'position'];
          const q = String(f.q);
          rows = rows.filter((r) => keys.some((k) => String(r[k] == null ? '' : r[k]).includes(q)));
        }
        if (t.filter) {
          const fv = f[t.filter.key];
          if (fv) rows = rows.filter((r) => String(r[t.filter.key] == null ? '' : r[t.filter.key]) === fv || String(r[t.filter.matchKey || 'status']).includes(fv));
        }
        return rows;
      };
    });

    page.rows = (tab, f) => (rowFns[tab] ? rowFns[tab](tab, f) : []);

    page.panel = (tab) => {
      const t = tabs.find((x) => x.key === tab) || tabs[0];
      return {
        title: t.title || cfg.panelTitle || cfg.title,
        filters: () => searchInput(cfg.key + ':' + t.key, cfg.searchPlaceholder || '搜索姓名 / 编号 / 单位')
          + (t.filter ? selectInput(cfg.key + ':' + t.key, t.filter.key, t.filter.options, t.filter.label) : ''),
        extra: cfg.export === false ? '' : exportBtn()
      };
    };

    return page;
  }

  /* 通用详情抽屉：读取当前行的字段并按标签展示 */
  function detailHTML(meta, row) {
    const labels = meta.labels || {};
    const fields = meta.detail || Object.keys(row).filter((k) => !['id', 'empNo', 'raw'].includes(k));
    const rows = fields.map((k) => {
      const label = labels[k] || (typeof k === 'object' ? k.label : k);
      const key = typeof k === 'object' ? k.key : k;
      const val = typeof k === 'object' && k.format ? k.format(row) : esc(row[key]);
      return `<dt>${esc(label)}</dt><dd>${val == null || val === '' ? '—' : val}</dd>`;
    }).join('');
    return `<dl class="desc-grid">${rows}</dl>`;
  }

  window.HR_SPEC_ADD = (cfg) => { window.HR_SPECS[cfg.key] = build(cfg); };
  window.HR_SPEC_HELP = { statusTag, chip, searchInput, selectInput, exportBtn, mcards, panel, esc, svg, detailHTML, autoChipCls };
})();

/* 全量菜单（严格对应功能清单二级功能） */
window.HR_MENU_FULL = [
  { key: 'dashboard', title: '工作台', icon: 'home', flat: true, page: 'home' },
  { key: 'organization', title: '组织机构管理', icon: 'building', children: [
    { t: '概览', p: 'org-overview' }, { t: '组织架构维护', p: 'org-structure' },
    { t: '岗位与编制管理', p: 'org-position' }, { t: '职位职级体系', p: 'org-rank' }] },
  { key: 'employee', title: '员工信息管理', icon: 'users', children: [
    { t: '基础信息', p: 'basic' }, { t: '工作信息', p: 'work' }, { t: '学历与履历', p: 'education' },
    { t: '资质证照', p: 'certificate' }, { t: '人事档案', p: 'archive' }] },
  { key: 'transfer', title: '员工异动管理', icon: 'swap', children: [
    { t: '入转调离', p: 'transfer-flow' }, { t: '职务变动', p: 'transfer-duty' }] },
  { key: 'seniority', title: '工龄与司龄管理', icon: 'clock', children: [
    { t: '工龄计算', p: 'seniority-calc' }, { t: '工龄认定', p: 'seniority-verify' }, { t: '工龄应用', p: 'seniority-apply' }] },
  { key: 'contract', title: '劳动合同与人事关系', icon: 'file', children: [
    { t: '合同管理', p: 'contract-manage' }, { t: '协议管理', p: 'contract-agreement' }, { t: '劳动争议', p: 'contract-dispute' }] },
  { key: 'recruit', title: '招聘与人员配置', icon: 'briefcase', children: [
    { t: '招聘需求', p: 'recruit-demand' }, { t: '招聘执行', p: 'recruit-execute' }, { t: '招聘类型', p: 'recruit-type' }] },
  { key: 'attendance', title: '考勤与排班管理', icon: 'calendar', children: [
    { t: '排班管理', p: 'attendance-schedule' }, { t: '考勤采集', p: 'attendance-collect' },
    { t: '假勤管理', p: 'attendance-leave' }, { t: '加班管理', p: 'attendance-overtime' }] },
  { key: 'salary', title: '薪酬管理', icon: 'wallet', children: [
    { t: '薪酬体系', p: 'salary-system' }, { t: '薪资核算', p: 'salary-calc' },
    { t: '薪酬调整', p: 'salary-adjust' }, { t: '薪酬分析', p: 'salary-analysis' }] },
  { key: 'benefit', title: '福利管理（五险一金）', icon: 'heart', children: [
    { t: '参保管理', p: 'benefit-insurance' }, { t: '缴费核算', p: 'benefit-payment' }, { t: '待遇办理', p: 'benefit-claim' }] },
  { key: 'performance', title: '绩效考核管理', icon: 'chart', children: [
    { t: '考核体系', p: 'performance-system' }, { t: '考核流程', p: 'performance-process' }, { t: '结果应用', p: 'performance-result' }] },
  { key: 'title', title: '职称与技能等级管理', icon: 'award', children: [
    { t: '职称管理', p: 'title-title' }, { t: '技能等级', p: 'title-skill' }, { t: '注册资格', p: 'title-register' }] },
  { key: 'training', title: '培训与人才发展', icon: 'book', children: [
    { t: '培训管理', p: 'training-manage' }, { t: '安全培训', p: 'training-safety' },
    { t: '人才培养', p: 'training-develop' }, { t: '在线学习', p: 'training-online' }] },
  { key: 'cadre', title: '干部管理与人才盘点', icon: 'usercheck', children: [
    { t: '干部管理', p: 'cadre-manage' }, { t: '人才盘点', p: 'cadre-inventory' }, { t: '政治面貌', p: 'cadre-political' }] },
  { key: 'safety', title: '职业健康与安全管理', icon: 'shield', children: [
    { t: '职业健康', p: 'safety-health' }, { t: '劳保管理', p: 'safety-labor' }, { t: '安全积分', p: 'safety-score' }] },
  { key: 'relation', title: '员工关系与关怀', icon: 'message', children: [
    { t: '员工关系', p: 'relation-relation' }, { t: '关怀服务', p: 'relation-care' }] },
  { key: 'system', title: '报表分析与系统管理', icon: 'chart', children: [
    { t: '统计分析', p: 'system-analysis' }, { t: '系统管理', p: 'system-admin' }] }
];
