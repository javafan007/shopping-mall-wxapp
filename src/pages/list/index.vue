
<template>
  <div class="page-container">
    <div class="side-bar">
      <div class="side-bar-item" :class="{'active' : item.id === filters.cat1 }"
            @click="onChangeCat1(item.id)"
            v-for="item in catList1"
            :key="item.id">
        <text>{{item.name}}</text>
      </div>
    </div>

    <!-- 右侧主内容 -->
    <div class="main-content">
      <van-dropdown-menu>
        <van-dropdown-item title="热门筛选" v-model="filters.cat2" :options="catList2" @change="onChangeCat2" />
        <van-dropdown-item title="商品排序" v-model="filters.sort" :options="sortList" @change="onChangeSort" />
      </van-dropdown-menu>

      <!-- 商品列表 -->
      <scroll-div scroll-y="true" style="height: calc(100vh - 50px);" bindscrolltolower="onScrollToBottom">
        <div v-for="item in goodsList" :key="item.id">
          <van-divider />
          <van-card
            :thumb="item.headerUrl"
            :title="item.name"
            :desc="item.subName"
            :price="item.price"
            :thumb-link="'/pages/detail/index?id='+ item.id"
          >
            <div slot="tags">
              <van-tag plain type="warning" v-if="item.badge">{{item.badge}}</van-tag>
            </div>
            <div slot="footer" style="height: 0">
              <van-icon name="shopping-cart-o" style="position: relative; top: -2rem;" size="1.5rem" />
            </div>
          </van-card>
        </div>
        <div style="text-align: center; padding: 20px 0 40px;">
          <van-loading size="24px" v-if="loading">加载中...</van-loading>
        </div>
      </scroll-div>
    </div>

  </div>
</template>

<script>
  import $http from '../../api/api-request'
  import Constants from '../../utils/Constants'

  const CAT_FIRST = 1
  const CAT_SECOND = 2

  export default {
    data () {
      return {
        filters: {
          cat1: '', // 一级分类
          cat2: '', // 二级分类
          sort: 1, // 排序
          page: 1 // 分页
        },

        catList1: [],
        catList2: [],
        goodsList: [],
        sortList: Constants.DICT_SORT_LIST,

        loading: false
      }
    },
    created () {
      this._loadCatList1().then(res => {
        if (this.catList1.length > 0) {
          const cat1 = this.catList1[0].id
          // 加载商品列表
          this._changeFilter({ cat1 })
          // 加载耳机分类
          this._loadCatList2(cat1)
        }
      })
    },
    methods: {

      // 选择一级分类
      onChangeCat1 (id) {
        this._changeFilter({ cat1: id, cat2: '', page: 1, sort: 1 })
        this._loadCatList2(id)
      },

      // 选择二级分类
      onChangeCat2 (e) {
        this._changeFilter({ cat2: e.mp.detail, page: 1, sort: 1 })
      },

      // 选择排序
      onChangeSort (e) {
        this._changeFilter({sort: e.mp.detail})
      },

      // 分页加载
      onScrollToBottom (e) {
        const nextPage = this.data.filters.page + 1
        this._changeFilter({ page: nextPage })
      },

      // 一级分类
      _loadCatList1 (callback) {
        return $http.get('sub/list')
          .then(data => {
            this.catList1 = data
          })
      },

      // 二级分类
      _loadCatList2: function (parentId) {
        $http.get(`cat/list/${parentId}`).then(catList2 => {
          const l = catList2.map(item => ({ value: item.id, text: item.name }))
          this.catList2 = [{ value: '', text: '全部' }, ...l]
        })
      },

      // 商品列表
      _loadGoodList: function () {
        if (this.loading) return
        const { cat1, cat2, sort, page } = this.filters
        this.loading = true
        $http.post('goo/list', {
          id: cat2 || cat1,
          type: cat2 ? CAT_SECOND : CAT_FIRST,
          sort,
          page
        }).then(({ list }) => {
          this.goodsList = page === 1 ? list : [...this.goodsList, ...list]
          this.loading = false
        })
      },

      _changeFilter (newFilters) {
        this.filters = {...this.filters, ...newFilters}
        this._loadGoodList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    display: flex;
    flex-direction: row;
    --card-thumb-size: 4rem;
  }

  /* 左侧一级菜单 */
  .side-bar {
    width: 25vw;
    height: 100vh;
    overflow: auto;
    font-size: 14px;
  }
  .side-bar-item {
    height: 50px;
    line-height: 50px;
    background: #eee;
    text-align: center;
  }
  .side-bar-item.active {
    background: #fff;
    color: red;
  }

  /* 右侧主内容 */
  .main-content {
    flex: 1;
    position: relative;
    box-sizing: border-box;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content .van-dropdown-item {
    position: absolute;
  }

  .goods-container {
    flex: 1;
    overflow-y: auto;
  }
</style>
